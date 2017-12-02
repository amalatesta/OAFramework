function _returnLovValue(
  closingWindow,
  event
  )
{
  // extract the return value
  var newValue = closingWindow.returnValue;
  
  if (newValue != (void 0))
  {
    // update the contents of the text field
    if (_agent.isSafari)
    {
      _lovField.value = newValue;
    }
    else
    {
      closingWindow._lovField.value = newValue;
    }
  }
}

function launchLov(
  destination,
  formName,
  nameInForm,
  appModId,
  lovvo,
  attr,
  dattr
  )
{
  var lovField = document.forms[formName][nameInForm];
  
  // add the correct first param separator
  destination += (destination.indexOf('?') == -1)
                    ? '?'
                    : '&';  
  destination += "appModId=" + appModId; 
  destination += "&lovvo=" + lovvo; 
  destination += "&attr=" + attr; 
  destination += "&dattr=" + dattr; 
  
  var calWindow = openWindow(self,
                             destination,
                             'LOV',
                             {width:400, height:450},
                             true,
                             void 0,
                             _returnLovValue);
  // save the date field on the calendar window for access
  // from event handler
  
  calWindow._lovField = lovField;
}

function launchLovDef(
  destination,
  formName,
  nameInForm,
  appConfig,
  appDef,
  lovvo,
  attr,
  dattr
  )
{
  var lovField = document.forms[formName][nameInForm];
  
  // add the correct first param separator
  destination += (destination.indexOf('?') == -1)
                    ? '?'
                    : '&';  
  destination += "appConfig=" + appConfig; 
  destination += "&appDef=" + appDef; 
  destination += "&lovvo=" + lovvo; 
  destination += "&attr=" + attr; 
  destination += "&dattr=" + dattr; 
  
  var calWindow = openWindow(self,
                             destination,
                             'LOV',
                             {width:400, height:450},
                             true,
                             void 0,
                             _returnLovValue);
  // save the date field on the calendar window for access
  // from event handler
  if (_agent.isSafari)
  {
    _lovField = lovField;
  }
  else
  {
    calWindow._lovField = lovField;
  }
}

var _lovField; // used by Safari only 
