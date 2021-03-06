package oracle.apps.fnd.framework.toolbox.schema.server;

import oracle.apps.fnd.framework.server.OAViewRowImpl;
import oracle.jbo.server.AttributeDefImpl;
import oracle.apps.fnd.common.VersionInfo;
//  ---------------------------------------------------------------
//  ---    File generated by Oracle Business Components for Java.
//  ---------------------------------------------------------------
// javadoc_private

public class SiteNameForIdVVORowImpl extends OAViewRowImpl {

    public static final int SITENAME = 0;
    public static final String RCS_ID="$Header: SiteNameForIdVVORowImpl.java 120.2 2006/07/03 22:08:54 atgops1 noship $";
  public static final boolean RCS_ID_RECORDED =
        VersionInfo.recordClassVersion(RCS_ID, "oracle.apps.fnd.framework.toolbox.schema.server");


    /**
     *
     * This is the default constructor (do not remove)
     */
  public SiteNameForIdVVORowImpl()
  {
  }

  /**
   * 
   * Gets the attribute value for the calculated attribute SiteName
   */
  public String getSiteName()
  {
    return (String)getAttributeInternal(SITENAME);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute SiteName
   */
  public void setSiteName(String value)
  {
    setAttributeInternal(SITENAME, value);
  }
  //  Generated method. Do not modify.

  protected Object getAttrInvokeAccessor(int index, AttributeDefImpl attrDef) throws Exception
  {
        switch (index) {
        case SITENAME:
            return getSiteName();
        default:
            return super.getAttrInvokeAccessor(index, attrDef);
        }
    }
  //  Generated method. Do not modify.

  protected void setAttrInvokeAccessor(int index, Object value, AttributeDefImpl attrDef) throws Exception
  {
        switch (index) {
        case SITENAME:
            setSiteName((String)value);
            return;
        default:
            super.setAttrInvokeAccessor(index, value, attrDef);
            return;
        }
    }
}
