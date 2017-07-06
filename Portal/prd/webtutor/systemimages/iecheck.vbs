' CourseLab IE Add-ons Check Module
' var iecheckVersion = "2.0";
' var iecheckBuildDate = "2005-Mar-25";
' (c)2002-2005 Websoft Ltd. http://www.courselab.ru/

Function vbCheck()
on error resume next
Dim swControl, swVersion
swVersion = "0.0"
If MSDetect = true Then
	If mvars.cv.flash = true Then
		For j = 4 to 10
			If Not(IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash." + CStr(j)))) Then
			Else
				Set swControl = CreateObject("ShockwaveFlash.ShockwaveFlash." + CStr(j))
  				If (IsObject(swControl)) Then
    				swVersion = CStr(j) + ".0"
  				End If
				system.flash.version = swVersion
				system.flash.installed = true
			End If
		Next
	End If
	If mvars.cv.sw = true Then
		For j = 5 to 10
			If Not(IsObject(CreateObject("SWCtl.SWCtl." + CStr(j)))) Then
			Else
				Set swControl = CreateObject("SWCtl.SWCtl." + CStr(j))
  				If (IsObject(swControl)) Then
    				swVersion = CStr(j) + ".0"
    				swVersion = CStr(swControl.ShockwaveVersion(""))
  				End If
				system.shockwave.version = swVersion
				system.shockwave.installed = true
			End If
		Next
	End If
	If mvars.cv.rm = true Then
		If Not(IsObject(CreateObject("rmocx.RealPlayer G2 Control.1" ))) Then
		Else
			Set swControl = CreateObject("rmocx.RealPlayer G2 Control.1")
  			If (IsObject(swControl)) Then
    			swVersion = CStr(1) + ".0"
    			swVersion = CStr(swControl.GetVersionInfo())
  			End If
			system.realplayer.version = swVersion
			system.realplayer.installed = true
		End If
	End If
	If mvars.cv.pdf = true Then
		For j = 3 to 8
			If Not(IsObject(CreateObject("Pdf.PdfCtrl." + CStr(j)))) Then
			Else
				Set swControl = CreateObject("Pdf.PdfCtrl." + CStr(j))
  				If (IsObject(swControl)) Then
    				swVersion = CStr(j) + ".0"
  				End If
				system.pdf.version = swVersion
				system.pdf.installed = true
			End If
		Next
	End If
	If mvars.cv.svg = true Then
		For j = 1 to 5
			If Not(IsObject(CreateObject("Adobe.SVGCtl." + CStr(j)))) Then
			Else
				Set swControl = CreateObject("Adobe.SVGCtl." + CStr(j))
  				If (IsObject(swControl)) Then
    				swVersion = CStr(j) + ".0"
  				End If
				system.svg.version = swVersion
				system.svg.installed = true
			End If
		Next
	End If
	If mvars.cv.qt = true Then
		If Not(IsObject(CreateObject("QuickTimeCheckObject.QuickTimeCheck.1"))) Then
		Else
			Set swControl = CreateObject("QuickTimeCheckObject.QuickTimeCheck.1")
			If (IsObject(swControl)) Then
   				swVersion = CStr(1) + ".0"
				swVersion = CInt(Hex(swControl.QuickTimeVersion)/1000000)
			End If
			system.quicktime.version = swVersion
			system.quicktime.installed = true
		End If
	End If
	If mvars.cv.mp = true Then
		If Not(IsObject(CreateObject("MediaPlayer.MediaPlayer.1"))) Then
		Else
			Set swControl = CreateObject("MediaPlayer.MediaPlayer.1")
  			If (IsObject(swControl)) Then
    			swVersion = CStr(1) + ".0"
				swVersion = WMP7.versionInfo
  			End If
			system.mediaplayer.version = swVersion
			system.mediaplayer.installed = true
		End If
	End If
End If
End Function