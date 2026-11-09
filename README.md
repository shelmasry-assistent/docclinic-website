# DocClinic website

One page (`index.html`), Arabic first with an English button. Hosted by GitHub Pages.

* `img/` — screenshots of DocClinic 1.4.30 (demo patients only) and the icon.
* `DOCTOR_TRIAL_AR.pdf` — the doctor's sheet (copied from the program's `docs/`).
* The registration form sends to a **Google Form**; after sending, the page shows the download of the doctor's specialty.
* The downloads are the files of the GitHub release `v1.4.30`: `DocClinic_1.4.30_<specialty>_windows.zip`
  (specialty = dental, derm, internal, endo, peds, obgyn, physio, all). Each is the **DocClinic** folder built on Windows
  (`build_exe\Build_DocClinic_Nuitka.bat` inside the copy made by `Make_Release.bat`), zipped.

## Connect the Google Form (once)

1. Make a Google Form with these questions, in this order, all "Short answer": Name, Specialty, Mobile, Email, City, Patients per day, Current system.
2. In the form: **⋮ → Get pre-filled link**, write `x` in every answer, **Get link**, copy it.
3. Give that link to Claude (or do it yourself): in `index.html`, `CONFIG.formAction` is the form address with
   `viewform` replaced by `formResponse`, and each `entry.NNN` of the link goes in `CONFIG.entries` in the same order.
4. The answers arrive in the form's **Responses** tab (and a Google Sheet if you link one).

## A new version

Build the 8 Windows zips, make a release `vX.Y.Z` with them, then change `version`, `downloadBase` and `file` in `CONFIG`.
