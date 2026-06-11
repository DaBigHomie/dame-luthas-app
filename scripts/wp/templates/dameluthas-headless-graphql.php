<?php
/**
 * Plugin Name: Dame Luthas Headless GraphQL
 * Description: Expose The Gem CPTs, Elementor data, and testimonial bodies for headless migration.
 */

declare(strict_types=1);

const DAMELUTHAS_GRAPHQL_POST_TYPES = [
	'thegem_pf_item'       => [ 'thegemPfItem', 'thegemPfItems' ],
	'thegem_templates'     => [ 'thegemTemplate', 'thegemTemplates' ],
	'thegem_title'         => [ 'thegemTitle', 'thegemTitles' ],
	'thegem_footer'        => [ 'thegemFooter', 'thegemFooters' ],
	'thegem_testimonial'   => [ 'thegemTestimonial', 'thegemTestimonials' ],
];

add_filter(
	'register_post_type_args',
	static function (array $args, string $post_type): array {
		if (!isset(DAMELUTHAS_GRAPHQL_POST_TYPES[$post_type])) {
			return $args;
		}

		[ $single, $plural ] = DAMELUTHAS_GRAPHQL_POST_TYPES[$post_type];
		$args['show_in_graphql']      = true;
		$args['graphql_single_name']  = $single;
		$args['graphql_plural_name']  = $plural;
		$args['public']               = $args['public'] ?? true;
		$args['show_in_rest']         = true;

		return $args;
	},
	99,
	2
);

add_filter(
	'graphql_post_entity_allowed_post_types',
	static function (array $post_types): array {
		foreach (array_keys(DAMELUTHAS_GRAPHQL_POST_TYPES) as $slug) {
			if (!in_array($slug, $post_types, true)) {
				$post_types[] = $slug;
			}
		}
		return $post_types;
	}
);

add_filter(
	'register_taxonomy_args',
	static function (array $args, string $taxonomy): array {
		if ($taxonomy !== 'thegem_portfolios') {
			return $args;
		}

		$args['show_in_graphql']     = true;
		$args['graphql_single_name'] = 'thegemPortfolio';
		$args['graphql_plural_name'] = 'thegemPortfolios';

		return $args;
	},
	10,
	2
);

/**
 * Resolve WP post ID from a WPGraphQL ContentNode source.
 */
function dameluthas_resolve_post_id($source): int {
	if (!is_object($source)) {
		return 0;
	}
	if (isset($source->databaseId)) {
		return (int) $source->databaseId;
	}
	if (isset($source->ID)) {
		return (int) $source->ID;
	}
	return 0;
}

add_action(
	'graphql_register_types',
	static function (): void {
		register_graphql_field(
			'ContentNode',
			'builderContent',
			[
				'type'        => 'String',
				'description' => 'Rendered Elementor HTML when post_content is empty',
				'resolve'     => static function ($source): ?string {
					$post_id = dameluthas_resolve_post_id($source);
					if ($post_id <= 0) {
						return null;
					}

					$wp_post = get_post($post_id);
					if (!$wp_post instanceof WP_Post) {
						return null;
					}

					if (trim((string) $wp_post->post_content) !== '') {
						return apply_filters('the_content', $wp_post->post_content);
					}

					$elementor_data = get_post_meta($post_id, '_elementor_data', true);
					if (empty($elementor_data) || !class_exists('\Elementor\Plugin')) {
						return null;
					}

					global $post;
					$post = $wp_post;
					setup_postdata($wp_post);

					$elementor = \Elementor\Plugin::$instance;
					$html      = $elementor->frontend->get_builder_content($post_id, true);

					wp_reset_postdata();

					return is_string($html) && $html !== '' ? $html : null;
				},
			]
		);

		register_graphql_field(
			'ContentNode',
			'elementorData',
			[
				'type'        => 'String',
				'description' => 'Raw Elementor JSON from _elementor_data post meta',
				'resolve'     => static function ($source): ?string {
					$post_id = dameluthas_resolve_post_id($source);
					if ($post_id <= 0) {
						return null;
					}

					$raw = get_post_meta($post_id, '_elementor_data', true);
					if (!is_string($raw) || $raw === '') {
						return null;
					}

					return $raw;
				},
			]
		);

		register_graphql_field(
			'ThegemTestimonial',
			'testimonialRole',
			[
				'type'        => 'String',
				'description' => 'Organization / role from TheGem custom fields',
				'resolve'     => static function ($source): ?string {
					$post_id = dameluthas_resolve_post_id($source);
					if ($post_id <= 0) {
						return null;
					}

					$meta_keys = [
						'thegem_testimonial_position',
						'testimonial_position',
						'position',
					];

					foreach ($meta_keys as $key) {
						$value = get_post_meta($post_id, $key, true);
						if (is_string($value) && trim($value) !== '') {
							return trim($value);
						}
					}

					return null;
				},
			]
		);

		register_graphql_field(
			'ThegemTestimonial',
			'testimonialQuote',
			[
				'type'        => 'String',
				'description' => 'Full testimonial body (post_content, then excerpt)',
				'resolve'     => static function ($source): ?string {
					$post_id = dameluthas_resolve_post_id($source);
					if ($post_id <= 0) {
						return null;
					}

					$wp_post = get_post($post_id);
					if (!$wp_post instanceof WP_Post) {
						return null;
					}

					$content = trim(wp_strip_all_tags((string) $wp_post->post_content));
					if ($content !== '') {
						return $content;
					}

					$excerpt = trim(wp_strip_all_tags((string) $wp_post->post_excerpt));
					if ($excerpt !== '') {
						return $excerpt;
					}

					return null;
				},
			]
		);

		register_graphql_object_type(
			'DameluthasTestimonialQuote',
			[
				'description' => 'Testimonial quote resolved directly from WP posts table',
				'fields'      => [
					'databaseId' => [ 'type' => 'Int' ],
					'author'     => [ 'type' => 'String' ],
					'quote'      => [ 'type' => 'String' ],
					'role'       => [ 'type' => 'String' ],
				],
			]
		);

		register_graphql_field(
			'RootQuery',
			'dameluthasTestimonialQuotes',
			[
				'type'        => [ 'list_of' => 'DameluthasTestimonialQuote' ],
				'description' => 'All published thegem_testimonial posts with full quote bodies',
				'resolve'     => static function (): array {
					$posts = get_posts(
						[
							'post_type'      => 'thegem_testimonial',
							'post_status'    => 'publish',
							'posts_per_page' => 50,
							'orderby'        => 'date',
							'order'          => 'ASC',
						]
					);

					$quotes = [];
					foreach ($posts as $post) {
						if (!$post instanceof WP_Post) {
							continue;
						}

						$content = trim(wp_strip_all_tags((string) $post->post_content));
						$excerpt = trim(wp_strip_all_tags((string) $post->post_excerpt));
						$quote   = $content !== '' ? $content : $excerpt;
						if ($quote === '') {
							continue;
						}

						$role = null;
						foreach ( [ 'thegem_testimonial_position', 'testimonial_position', 'position' ] as $key ) {
							$value = get_post_meta($post->ID, $key, true);
							if (is_string($value) && trim($value) !== '') {
								$role = trim($value);
								break;
							}
						}

						$quotes[] = [
							'databaseId' => (int) $post->ID,
							'author'     => get_the_title($post),
							'quote'      => $quote,
							'role'       => $role,
						];
					}

					return $quotes;
				},
			]
		);
	},
	10
);
