function _returnCalendarValue(
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
      _dateField.value = newValue;
    }
    else
    {
      closingWindow._dateField.value = newValue;
    }
  }
}

function launchDatePicker(
  destination,
  formName,
  nameInForm,
  format,
  formatter,
  minValue,
  maxValue
  )
{
  var dateField = document.forms[formName][nameInForm];
  
  // add the correct first param separator
  destination += (destination.indexOf('?') == -1)
                    ? '?'
                    : '&';  
  destination += "origValue=" + dateField.value;
  if (format != (void 0))
  {
    destination += "&format=" + format; 
  }

  if (formatter != (void 0))
  {
    destination += "&formatter=" + formatter; 
  }
  
  // add on min and max value attributes
  if (minValue != (void 0))
  {
    destination += "&minValue=" + minValue; 
  }
  if (maxValue != (void 0))
  {
    destination += "&maxValue=" + maxValue; 
  }
  
  var calWindow = openWindow(self,
                             destination,
                             'calendar',
                             {width:250, height:280},
                             true,
                             void 0,
                             _returnCalendarValue);
  // save the date field on the calendar window for access
  // from event handler
  if (_agent.isSafari)
  {
    _dateField = dateField;
  }
  else
  {
    calWindow._dateField = dateField;
  }
}

var _dateField; // used by Safari only 
