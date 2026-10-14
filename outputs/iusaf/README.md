# Inverted UN Scale of Assessments Formula (IUSAF)

## Run

Open `IUSAF-staircase.html` in Safari, Chrome, Edge, or Firefox. It is a self-contained offline application: no installation, account, server, or internet connection is required.

Alternatively open `index.html`, keeping `app.js`, `model.js`, `countries.js`, and `style.css` in the same folder. Use the single-file version when emailing or copying the application.

Select **Present full screen** for presentations; Escape exits. If your browser disallows the full-screen button for local files, use its normal full-screen menu. Browser zoom can adjust the presentation size.

## Explore

- Choose an illustrative fund of $50 million, $200 million, $500 million or $1 billion. All country amounts and band totals update. Reset restores the weights while keeping your selected fund.

- Drag Steepness from 1:1 to 10:1, or type the ratio in “Or enter a ratio” (up to two decimal places). Both controls reshape all six weights. The baseline is 3.75:1.
- Edit any of the six weights to explore other shapes. Moving the slider replaces all manual weights.
- Set Band 2 to 1.5 to show an equality with Band 1. Set it to 1.6 to show a violation.
- Teal means a strict decrease, amber means equality, and red means a violation. The five adjacent comparison labels also state the relationship without relying on colour.
- Reset restores the supplied weights and baseline slider position.
- Non-negative weights are accepted; at least one must be positive. Invalid edits retain and dim the last valid result, with an error message. A zero Band 6 weight yields an infinite ratio if Band 1 is positive, or an undefined ratio if both endpoint weights are zero.
- Changes animate for 320 ms; the app honours the system's reduced-motion preference.

## Inputs and calculation

142 Parties; counts `[31,59,30,18,3,1]`; baseline weights `[1.5,1.3,1.1,0.95,0.75,0.4]`; default fund USD 1,000,000,000, selectable from four presets.

Per-Party allocation in band i = fund × weight i / sum(count j × weight j).

Baseline weighted denominator: 175.95. Band 1 receives USD 8,525,149.190110827 per Party; Band 6 receives USD 2,273,373.1173628876. Ratio: 3.75:1. Dollar displays are rounded; all calculations use unrounded values. The exact mathematical allocation exhausts the fund; displayed rounded totals can differ slightly.

The slider uses a power family:

`weight_i(r) = 0.4 * (baseline_i / 0.4) ** (ln(r) / ln(3.75))`

This yields equal weights at r=1, the supplied baseline at r=3.75, and endpoint ratio r throughout. The staircase has equal-width bands; width does not represent membership. The vertical axis normally remains fixed at 1.2% of the selected fund, expanding when manual allocations exceed that range.

Inputs were supplied explicitly in the request. `/mnt/data/table1.pdf` was unavailable and the referenced conversation exposed no downloadable attachments, so the PDF itself was not verified.

## Modular extension

`model.js` exports pure `allocateEquity(weights, fund, parties)` and `weightsForRatio(ratio)` functions independently of the interface. The allocation result contains per-Party amounts, band totals, denominator, endpoint ratio, and adjacent monotonicity checks.

The fund argument is the full selected illustrative fund. SOSAC (3%) and TSAC are intentionally not implemented or deducted. In a later version, pass the agreed equity budget into `allocateEquity`, calculate stewardship components separately, and compose the results outside this function. If stewardship differs between Parties within a band, final combined checks must operate at Party level rather than assume equal amounts within a band.

`app.js` handles controls and animation; `style.css` handles presentation. The single-file version embeds these same sources. After source edits, regenerate it by replacing the index stylesheet and script references with their contents.

## Verification

With Node.js installed, run `node model.test.js` from this folder. Tests cover baseline values, fund conservation across the slider range, monotonicity, equality, violations, and invalid/zero weights. JavaScript syntax was checked. The built-in browser loaded the local preview successfully. Baseline values and the 1:1 and 10:1 slider states were verified, the desktop staircase was visually inspected, and no browser console errors were reported. Concurrent changes in the preview prevented reliable completion of manual-weight and reset interaction tests. Mobile layout and full-screen transitions remain unverified.

## Country lookup

Expand a band in Allocation detail to see its countries, or search by country name or three-letter code below the band table. Country allocations update with the current weights. The 142-country list comes from the local version 3 model; all six counts, weights, and baseline allocations were validated. See COUNTRY-SOURCE.md for provenance. Names and membership are a fixed scenario snapshot.

Browser checks confirmed that search for KEN returns Kenya, a Band 3 weight change updates its allocation, and the Band 5 disclosure lists Brazil, India, and Mexico.
