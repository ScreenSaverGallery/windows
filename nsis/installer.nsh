# see: https://nsis.sourceforge.io/EnumUsersReg
# This script will enumerate all local users and load their registry hives (HKCU) one by one.
# You can use it to delete settings of logged off users.
!include "EnumUsersReg.nsh"

Function "SetUsersRegistry"
  # your code here
  Pop $0
  # changeable
  WriteRegStr HKU "$0\Control Panel\Desktop" "ScreenSaveTimeOut" "240" # set default change-able timing for each user, note: this will take effect after logout and login back again :(
  # non-changeable
  WriteRegStr HKU "$0\Software\Policies\Microsoft\Windows\Control Panel\Desktop" "SCRNSAVE.EXE" "$INSTDIR\ScreenSaverGallery.scr"
  WriteRegStr HKU "$0\Software\Policies\Microsoft\Windows\Control Panel\Desktop" "ScreenSaveActive" "1"
FunctionEnd

Function "un.SetUsersRegistry"
  # your code here
  Pop $0
  # non-changeable
  DeleteRegValue HKU "$0\Software\Policies\Microsoft\Windows\Control Panel\Desktop" "SCRNSAVE.EXE"
  DeleteRegValue HKU "$0\Software\Policies\Microsoft\Windows\Control Panel\Desktop" "ScreenSaveActive"
  # user-specific (set every ssg run)
  DeleteRegValue HKU "$0\Control Panel\Desktop" "SCRNSAVE.EXE"
  DeleteRegValue HKU "$0\Control Panel\Desktop" "ScreenSaveActive"
FunctionEnd


!macro preInit
  #
!macroend

!macro customInstall
  # rename exe to src
  Rename "$INSTDIR\ScreenSaverGallery.exe" "$INSTDIR\ScreenSaverGallery.scr"
  Delete "$INSTDIR\ScreenSaverGallery.exe"
  # create desktop shortcut -> run it is the only way how to setup screensaver
  CreateShortCut "$DESKTOP\ScreenSaverGallery.scr.lnk" "$INSTDIR\ScreenSaverGallery.scr"
  # load default profile for new users
  nsExec::Exec "REG LOAD HKU\SSGDefault C:\Users\Default\ntuser.dat"
  # add registry for all users (include itself)
  ${EnumUsersReg} SetUsersRegistry temp.key
  # unload default profile for new users
  nsExec::Exec "REG UNLOAD HKU\SSGDefault"
  # run after installation
  ExecShell open "$INSTDIR\ScreenSaverGallery.scr"
!macroend

!macro customUnInstall
  # remove hkcu
  DeleteRegValue HKCU "Control Panel\Desktop" "SCRNSAVE.EXE"
  DeleteRegValue HKCU "Control Panel\Desktop" "ScreenSaveActive"
  # load default profile for new users
  nsExec::Exec "REG LOAD HKU\SSGDefault C:\Users\Default\ntuser.dat"
  # delete all users setup screensaver from registry (include itself)
  ${un.EnumUsersReg} un.SetUsersRegistry temp.key
  # unload default profile for new users
  nsExec::Exec "REG UNLOAD HKU\SSGDefault"
  # remove desktop shortcut
  Delete "$DESKTOP\ScreenSaverGallery.scr.lnk"
!macroend