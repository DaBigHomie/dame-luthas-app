<?php
/**
 * Rank Math redirection id=2: destination was listed as its own source → redirect loop.
 * Keep only the legacy slug pf/amazon-labor-union/ → canonical portfolio URL.
 */
$domain = getenv('DAME_LUTHAS_DOMAIN') ?: 'dameluthas.local';

global $wpdb;

$table = $wpdb->prefix . 'rank_math_redirections';
$cache = $wpdb->prefix . 'rank_math_redirections_cache';

$row = $wpdb->get_row('SELECT id FROM {$table} WHERE id = 2');
if (!$row) {
    echo "no_redirect_id_2\n";
    return;
}

$sources = maybe_serialize([
    [
        'ignore' => '',
        'pattern' => 'pf/amazon-labor-union/',
        'comparison' => 'exact',
    ],
]);

$wpdb->update(
    $table,
    [
        'sources' => $sources,
        'url_to' => "http://{$domain}/pf/amazon-labor-union-digital-transformation/",
        'updated' => current_time('mysql'),
    ],
    ['id' => 2]
);

$wpdb->query("DELETE FROM {$cache}");

$post = get_page_by_path('amazon-labor-union-digital-transformation', OBJECT, 'thegem_pf_item');
if ($post) {
    delete_post_meta($post->ID, 'rank_math_auto_redirect');
}

echo 'fixed_redirect_id_2 post=' . ($post->ID ?? 'n/a') . "\n";
