// Points Netkeiba's premium video icons straight to the race's replay box.
for (const icon of document.querySelectorAll('a.Btn_PopupSuperPremium')) {
    const row = icon.closest('tr, li');
    if (!row || icon.closest('.VideoSampleThum')) continue; // race page box: handled by content.js

    // Race ID comes from the single race link in the icon's row or card
    const ids = new Set([...row.querySelectorAll('a[href*="/db/race/"]')]
        .map((a) => a.href.match(/\/db\/race\/(\d{12})\//)?.[1]).filter(Boolean));
    if (ids.size !== 1) continue;
    const [id] = ids;
    Object.assign(icon, { href: `https://en.netkeiba.com/db/race/${id}/#VideoBox`, title: 'Watch the replay' });
    icon.dataset.nkrpReplay = id;
}

// Stop clicks before Netkeiba's document-level popup handler, so the link is just followed
window.addEventListener('click', (e) => {
    if (e.target.closest?.('a[data-nkrp-replay]')) e.stopPropagation();
}, true);
