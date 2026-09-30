# Life at 8x — redesign concept

A responsive, homepage-first redesign built from a review of 8x.life, the 8x Product Designer posting, 8x Social for Brands, and the e2.vc reference.

**Public preview:** https://gorkemberkgundogdu-alt.github.io/8x-life-redesign-concept/

Open `index.html` directly, or run `node server.js` and visit http://127.0.0.1:4173.

The site uses publicly available 8x Careers team portraits. Each portrait links to the original team story section. All role and business links point to the live 8x sites.

Research and rationale are in [research/brief.md](research/brief.md). A camera-on walkthrough outline is in [walkthrough.md](walkthrough.md).

The latest revision includes a category menu, an editorial workflow, a four-business typographic atlas, selectable role criteria, and a dark identity footer. Local browser QA checks 320, 390, 768, and 1440px widths, image loading, menu hover/Escape, keyboard tabs, and horizontal overflow with `node verify-v2.js`. `node check-links.js` checks every external destination and the story anchor in a signed-out browser. `node capture-v3.js` captures the redesigned atlas and footer at desktop and mobile widths.
