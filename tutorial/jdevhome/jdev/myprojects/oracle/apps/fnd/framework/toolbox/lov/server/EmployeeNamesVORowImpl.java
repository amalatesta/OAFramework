package oracle.apps.fnd.framework.toolbox.lov.server;

import oracle.apps.fnd.framework.server.OAViewRowImpl;
import oracle.jbo.server.AttributeDefImpl;
import oracle.jbo.domain.Number;
import oracle.apps.fnd.common.VersionInfo;
//  ---------------------------------------------------------------
//  ---    File generated by Oracle Business Components for Java.
//  ---------------------------------------------------------------
// javadoc_private

public class EmployeeNamesVORowImpl extends OAViewRowImpl {

    public static final int EMPLOYEENAME = 0;
    public static final String RCS_ID="$Header: EmployeeNamesVORowImpl.java 120.2 2006/07/03 14:41:47 atgops1 noship $";
  public static final boolean RCS_ID_RECORDED =
        VersionInfo.recordClassVersion(RCS_ID, "oracle.apps.fnd.framework.toolbox.lov.server");
    public static final int EMPLOYEENUMBER = 1;
    public static final int EMAILADDRESS = 2;
    public static final int FIRSTNAME = 3;
    public static final int LASTNAME = 4;


    /**
     *
     * This is the default constructor (do not remove)
     */
  public EmployeeNamesVORowImpl()
  {
  }

  /**
   * 
   * Gets the attribute value for the calculated attribute EmployeeName
   */
  public String getEmployeeName()
  {
    return (String)getAttributeInternal(EMPLOYEENAME);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute EmployeeName
   */
  public void setEmployeeName(String value)
  {
    setAttributeInternal(EMPLOYEENAME, value);
  }

  /**
   * 
   * Gets the attribute value for the calculated attribute EmployeeNumber
   */
  public Number getEmployeeNumber()
  {
    return (Number)getAttributeInternal(EMPLOYEENUMBER);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute EmployeeNumber
   */
  public void setEmployeeNumber(Number value)
  {
    setAttributeInternal(EMPLOYEENUMBER, value);
  }

  /**
   * 
   * Gets the attribute value for the calculated attribute EmailAddress
   */
  public String getEmailAddress()
  {
    return (String)getAttributeInternal(EMAILADDRESS);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute EmailAddress
   */
  public void setEmailAddress(String value)
  {
    setAttributeInternal(EMAILADDRESS, value);
  }
  //  Generated method. Do not modify.

  protected Object getAttrInvokeAccessor(int index, AttributeDefImpl attrDef) throws Exception
  {
        switch (index) {
        case EMPLOYEENAME:
            return getEmployeeName();
        case EMPLOYEENUMBER:
            return getEmployeeNumber();
        case EMAILADDRESS:
            return getEmailAddress();
        case FIRSTNAME:
            return getFirstName();
        case LASTNAME:
            return getLastName();
        default:
            return super.getAttrInvokeAccessor(index, attrDef);
        }
    }
  //  Generated method. Do not modify.

  protected void setAttrInvokeAccessor(int index, Object value, AttributeDefImpl attrDef) throws Exception
  {
        switch (index) {
        case EMPLOYEENAME:
            setEmployeeName((String)value);
            return;
        case EMPLOYEENUMBER:
            setEmployeeNumber((Number)value);
            return;
        case EMAILADDRESS:
            setEmailAddress((String)value);
            return;
        case FIRSTNAME:
            setFirstName((String)value);
            return;
        case LASTNAME:
            setLastName((String)value);
            return;
        default:
            super.setAttrInvokeAccessor(index, value, attrDef);
            return;
        }
    }

  /**
   * 
   * Gets the attribute value for the calculated attribute FirstName
   */
  public String getFirstName()
  {
    return (String)getAttributeInternal(FIRSTNAME);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute FirstName
   */
  public void setFirstName(String value)
  {
    setAttributeInternal(FIRSTNAME, value);
  }

  /**
   * 
   * Gets the attribute value for the calculated attribute LastName
   */
  public String getLastName()
  {
    return (String)getAttributeInternal(LASTNAME);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute LastName
   */
  public void setLastName(String value)
  {
    setAttributeInternal(LASTNAME, value);
  }
}