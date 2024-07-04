!macro preInit
  #
!macroend

!macro customInstall
  # rename exe to src
  Rename "$INSTDIR\ScreenSaverGallery.exe" "$INSTDIR\ScreenSaverGallery.scr"
  Delete "$INSTDIR\ScreenSaverGallery.exe"
  # create desktop shortcut -> run it is the only way how to setup screensaver
  CreateShortCut "$DESKTOP\ScreenSaverGallery.scr.lnk" "$INSTDIR\ScreenSaverGallery.scr"
  # add registry for user
  WriteRegStr HKCU "Control Panel\Desktop" "SCRNSAVE.EXE" "$INSTDIR\ScreenSaverGallery.scr"
  WriteRegStr HKCU "Control Panel\Desktop" "ScreenSaveActive" "1"
  WriteRegStr HKCU "Control Panel\Desktop" "ScreenSaveTimeOut" "420"
  # run after installation
  ExecShell open "$INSTDIR\ScreenSaverGallery.scr"
!macroend

!macro customUnInstall
  # delete user setup screensaver from registry
  DeleteRegValue HKCU "Control Panel\Desktop" "SCRNSAVE.EXE"
  DeleteRegValue HKCU "Control Panel\Desktop" "ScreenSaveActive"
  DeleteRegValue HKCU "Control Panel\Desktop" "ScreenSaveTimeOut"
  # remove desktop shortcut
  Delete "$DESKTOP\ScreenSaverGallery.scr.lnk"
!macroend