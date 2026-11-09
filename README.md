# DocClinic website

One page (`index.html`), Arabic first with an English button. Hosted by GitHub Pages.

* `img/` — screenshots of DocClinic 1.4.30 (demo patients only) and the icon.
* `DOCTOR_TRIAL_AR.pdf` — the doctor's sheet (copied from the program's `docs/`).
* The registration form writes to a **Google Sheet** (see below); after sending, the page shows the download of the doctor's specialty.
* The downloads are the files of the GitHub release `v1.4.30`: `DocClinic_1.4.30_<specialty>_windows.zip`
  (specialty = dental, derm, internal, endo, peds, obgyn, physio, all). Each is the **DocClinic** folder built on Windows
  (`build_exe\Build_DocClinic_Nuitka.bat` inside the copy made by `Make_Release.bat`), zipped.

## Connect the Google Sheet (once)

The form sends each registration to a Google Sheet through a small Apps Script (`google-sheet/register.gs`):
1. New Google Sheet → Extensions → Apps Script → paste `google-sheet/register.gs`, change `SECRET`.
2. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → copy the URL (ends with `/exec`).
3. Put it in `index.html`: `CONFIG.sheetUrl`.
4. Registrations: the sheet "Registrations", or as JSON at `<URL>?key=<SECRET>` (keep the key private: the list has phone numbers).

## A new version

Build the 8 Windows zips, make a release `vX.Y.Z` with them, then change `version`, `downloadBase` and `file` in `CONFIG`.
