<?php
/**
 * Plugin Name: Dame Luthas Headless GraphQL
 * Description: Expose The Gem CPTs and Elementor-rendered HTML for headless migration.
 */

declare(strict_types=1);

const DAMELUTHAS_GRAPHQL_POST_TYPES = [
	'thegem_pf_item'     => [ 'thegemPfItem', 'thegemPfItems' ],
	'thegem_templates'   => [ 'thegemTemplate', 'thegemTemplates' ],
	'thegem_title'       => [ 'thegemTitle', 'thegemTitles' ],
	'thegem_footer'      => [ 'thegemFooter', 'thegemFooters' ],
];

add_filter(
	'register_post_type_args',
	static function (array $args, string $post_type): array {
		if (!isset(DAMELUTHAS_GRAPHQL_POST_TYPES[$post_type])) {
			return $args;
		}

		[$single, $plural] = DAMELUTHAS_GRAPHQL_POST_TYPES[$post_type];
		$args['show_in_graphql']     = true;
		$args['graphql_single_name'] = $single;
		$args['graphql_plural_name'] = $plural;

		return $args;
	},
	10,
	2
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
					$post_id = 0;

					if (is_object($source)) {
						if (isset($source->databaseId)) {
							$post_id = (int) $source->databaseId;
						} elseif (isset($source->ID)) {
							$post_id = (int) $source->ID;
						}
					}

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
					$html        = $elementor->frontend->get_builder_content($post_id, true);

					wp_reset_postdata();

					return is_string($html) && $html !== '' ? $html : null;
				},
			]
		);
	},
	10
);
