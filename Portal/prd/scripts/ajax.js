ajax = {
	load : function (sUrl,sFuncName,sMethod,oData,sReturnType,fCallback) {
		sUrl = "ajax_controller.xml?page="  + sUrl + "&result_type=" + sReturnType;
		if(sFuncName != null && sFuncName != "")
			sUrl += "&func=" + sFuncName;
		$.ajax({
				url: sUrl,  
				data : oData,    
				type : sMethod,
				success: function (oResult, sTextStatus) { 	
					if($.trim($(oResult).find('error').text()) == "")
					{
						if(fCallback)
						{
							if(sReturnType == "xml")
								fCallback($(oResult).find('data')[0]);		
							else
								fCallback($(oResult).find('data').text());									
						}
					}
					else
					{		
						alert("Error: " + $(oResult).find('error').text());
					}
						
				},
				
				ajaxError: function (oErrData) {
						alert("Ajax error: " + oErrData);
				}
		}
		);
	},
	
	post : function (sUrl,sFuncName,oData,sReturnType,fCallback) {
		this.load(sUrl,sFuncName,"POST",oData,sReturnType,fCallback);
	},
	
	
	get : function (sUrl,sFuncName,oData,sReturnType,fCallback) {
		this.load(sUrl,sFuncName,"GET",oData,sReturnType,fCallback);
	},
	
	postFormData : function (sUrl,sFuncName,sFormName,oData,sReturnType,fCallback) {
		var sFormData = this.getFormData(sFormName);
		this.disableFormFields(sFormName);
		if(sFormData.length > 0)
			oData = sFormData + "&" + oData;
//		this.load(sUrl,sFuncName,"POST",oData,sReturnType,fCallback);
		this.load(sUrl,sFuncName,"POST",oData,sReturnType, function(oResult)
					{
						ajax.enableFormFields(sFormName);
						fCallback(oResult);
					}
				  );
	
	},
	
	
	showLoader : function (sObjectId) {
		$("#" + sObjectId).html($('<table width="100%" height="100%"><tr><td style="text-align:center; height:50%" align="center"><img src="pics/ajax-loader.gif" alt="Downloading..."/></td></tr><tr><td height="50%" style="text-align:center; height:50%"><div style="text-align:center;">Downloading</div></td></tr></table>'));
	},
	
	hideLoader : function (sObjectId) {
		$("#" + sObjectId).html("");
	},
	
	disableFormFields : function (sFormName)
	{
		$("#" + sFormName).find('input').each(			
			  function()
			  {
					this.disabled = true;
			  }										   
		)	
		$("#" + sFormName).find('textarea').each(			
			  function()
			  {
					this.disabled = true;
			  }										   
		)
		$("#" + sFormName).find('select').each(			
			  function()
			  {
					this.disabled = true;
			  }										   
		)
	},
	
	enableFormFields : function (sFormName)
	{
		$("#" + sFormName).find('input').each(			
			  function()
			  {
					this.disabled = false;
			  }										   
		)	
		$("#" + sFormName).find('textarea').each(			
			  function()
			  {
					this.disabled = false;
			  }										   
		)
		$("#" + sFormName).find('select').each(			
			  function()
			  {
					this.disabled = false;
			  }										   
		)
	},
	
	getFormData : function (sFormName)
	{
		data = "";
		if(sFormName != "" && sFormName != null)
		{
			$("#" + sFormName).find('input:text').each(			
				  function()
				  {
						data += this.name + "=" + escape(this.value) + "&";
				  }										   
			)
			$("#" + sFormName).find('input:password').each(			
				  function()
				  {
						data += this.name + "=" + escape(this.value) + "&";
				}
			)
			$("#" + sFormName).find('input:checkbox').filter(":checked").each(			
				  function()
				  {
						data += this.name + "=" + escape(this.value) + "&";
				  }										   
			)
			$("#" + sFormName).find('input:radio').filter(":checked").each(			
				  function()
				  {
						data += this.name + "=" + escape(this.value) + "&";
				  }										   
			)
			$("#" + sFormName).find('input:hidden').each(			
				  function()
				  {
						data += this.name + "=" + escape(this.value) + "&";
				  }										   
			)
			$("#" + sFormName).find('textarea').each(			
				  function()
				  {
						data += this.name + "=" + escape(this.value) + "&";
				  }										   
			)
			$("#" + sFormName).find('select').each(			
				  function()
				  {
						data += this.name + "=" + (this.value) + "&";
				  }										   
			)
			if(data.charAt(data.length - 1) == "&")
				data = data.substring(0, data.length - 1);
			
		}
		return data;
	},
	
	fillFormFromResult: function (formName, result){
		$(result).children().each(			
				  function()
				  {
					  	var field = $("#" + this.nodeName).get(0);
						if(field != null)
						{
							if((field.tagName == "textarea" || field.tagName == "TEXTAREA" || field.tagName == "input" || field.tagName == "INPUT") && field.type != "checkbox")
							{
								field.value = $(this).text();
							}
							else if(field.type == "checkbox")
							{
								if($(this).text() == "true" || $(this).text() == "1")
									field.checked = true;
								else						
									field.checked = false;
							}
							else if(field.tagName == "select" || field.tagName == "SELECT")
							{
								field.selectedIndex = -1;
								$(field).find("option:#" + $(this).text()).get(0).selected = true;
							}
							else
							{						
								field.innerHTML = $(this).text();	
							}
						}
				  }										   
			)
		return;
	}
}
var loaderImage = $('<table width="100%" height="100%"><tr><td height="50%" style="text-align: center"><img src="pics/ajax-loader.gif" alt="Loading..."/></td>' + 
					 + '<td height="50%"><div align="center">Downloading</div></td></tr></table>');
