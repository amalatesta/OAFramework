package oracle.apps.fnd.framework.toolbox.lov.server;

import oracle.apps.fnd.framework.server.OAViewRowImpl;
import oracle.jbo.server.AttributeDefImpl;
import oracle.jbo.domain.Number;
import oracle.apps.fnd.common.VersionInfo;
//  ---------------------------------------------------------------
//  ---    File generated by Oracle Business Components for Java.
//  ---------------------------------------------------------------
// javadoc_private

public class SupplierSitesLOVVORowImpl extends OAViewRowImpl {

    public static final int SUPPLIERID = 0;
    public static final String RCS_ID="$Header: SupplierSitesLOVVORowImpl.java 120.2 2006/07/03 15:01:07 atgops1 noship $";
  public static final boolean RCS_ID_RECORDED =
        VersionInfo.recordClassVersion(RCS_ID, "oracle.apps.fnd.framework.toolbox.lov.server");
    public static final int SUPPLIERSITEID = 1;
    public static final int SITENAME = 2;
    public static final int NAME = 3;


    /**
     *
     * This is the default constructor (do not remove)
     */
  public SupplierSitesLOVVORowImpl()
  {
  }

  /**
   * 
   * Gets the attribute value for the calculated attribute SupplierId
   */
  public Number getSupplierId()
  {
    return (Number)getAttributeInternal(SUPPLIERID);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute SupplierId
   */
  public void setSupplierId(Number value)
  {
    setAttributeInternal(SUPPLIERID, value);
  }

  /**
   * 
   * Gets the attribute value for the calculated attribute SupplierSiteId
   */
  public Number getSupplierSiteId()
  {
    return (Number)getAttributeInternal(SUPPLIERSITEID);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute SupplierSiteId
   */
  public void setSupplierSiteId(Number value)
  {
    setAttributeInternal(SUPPLIERSITEID, value);
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

  /**
   * 
   * Gets the attribute value for the calculated attribute Name
   */
  public String getName()
  {
    return (String)getAttributeInternal(NAME);
  }

  /**
   * 
   * Sets <code>value</code> as the attribute value for the calculated attribute Name
   */
  public void setName(String value)
  {
    setAttributeInternal(NAME, value);
  }
  //  Generated method. Do not modify.

  protected Object getAttrInvokeAccessor(int index, AttributeDefImpl attrDef) throws Exception
  {
        switch (index) {
        case SUPPLIERID:
            return getSupplierId();
        case SUPPLIERSITEID:
            return getSupplierSiteId();
        case SITENAME:
            return getSiteName();
        case NAME:
            return getName();
        default:
            return super.getAttrInvokeAccessor(index, attrDef);
        }
    }
  //  Generated method. Do not modify.

  protected void setAttrInvokeAccessor(int index, Object value, AttributeDefImpl attrDef) throws Exception
  {
        switch (index) {
        case SUPPLIERID:
            setSupplierId((Number)value);
            return;
        case SUPPLIERSITEID:
            setSupplierSiteId((Number)value);
            return;
        case SITENAME:
            setSiteName((String)value);
            return;
        case NAME:
            setName((String)value);
            return;
        default:
            super.setAttrInvokeAccessor(index, value, attrDef);
            return;
        }
    }
}