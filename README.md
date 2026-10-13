# Loadout Roulette

Military styled browser app with searchable weapons and attachments, five standard attachments from five different categories, optional kit names and photos, automatic local saving, backup/import, and repeatable roulette. Reset clears wheel membership and preserves the armory.

## Catalog — October 12, 2026

22 officially named beta weapons. The app contains 995 standard weapon–attachment relationships across 17 weapons, sourced from AzerPUG’s public MW4 Companion data and compared with CODMunity and WZRanked. A shared attachment appears under every listed compatible weapon; this is not 995 unique attachments.

Five official M4 blueprint attachments retain their original IDs and names so previously saved kits and backups still restore. All other catalog options are labeled Community Beta. The builder only shows categories present on the current weapon and provides a per-weapon attachment search. Category headings expand menus; only individual attachment buttons select equipment.

Apex names are separate, read-only references outside the five standard slots. Catalog categories include Trigger Action, Bolt, Comb and Guard where listed. Axion, Sang 9mm and Wz. 55 Striga still lack standard lists; PILA and Combat Knife cannot use the beta Gunsmith. Fictional sample mode remains explicitly labeled and older sample kits remain restorable.

This does not certify final MW4 Warzone compatibility, attachment conflicts, conversion-specific interactions or a complete launch arsenal. The 105 alternative source rows requiring spelling or compatibility review are not automatically selectable. Source links and provenance are retained in catalog records and catalog-provenance.json.

Sources:
- https://mw4.azerpug.com/weapons
- https://codmunity.gg/mw4
- https://wzranked.com/games/call-of-duty-modern-warfare-4/meta
- https://www.callofduty.com/blog/2026/08/call-of-duty-modern-warfare-4-open-beta-everything-you-need-to-know
- https://www.callofduty.com/blog/2026/09/call-of-duty-modern-warfare-4-preorder-bonus-inner-circuit-m4-blueprint

## Checks

Run `node verify.cjs`. Verifies all 995 records can round-trip in five-category backups, 17 weapons can build/save/restore kits, attachment search, old official/sample backup compatibility, cross-weapon validation, slot exclusivity, five-slot limit, repeat spins, reset persistence, JavaScript syntax, DOM references and 60,300 wheel alignment scenarios. Browser visual QA is unavailable in this environment.

## Weapon artwork

All 22 catalog weapons use locally hosted official beta promotional images. Responsive image windows show the base weapon while keeping informational source-card panels outside the visible area. Thumbnails appear alongside weapon names, in the draft builder, saved loadouts and winning results. Images do not dynamically depict the selected attachments. Existing custom kit photos still take precedence. Header, armory placeholder, wheel center, hero decoration and app icon use native SVG bullet artwork. Original image URLs are preserved in weapon-image-provenance.json.

## GitHub Pages

In repository Settings → Pages, choose Deploy from a branch, main, and /docs, then Save. The public app URL is https://tjsenesac18.github.io/loadout-roulette/.

Saved loadouts are stored in each browser. Use Export backup on the existing app and Import backup here to move them between websites.
