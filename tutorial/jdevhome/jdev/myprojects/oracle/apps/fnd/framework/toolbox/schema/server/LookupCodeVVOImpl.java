package oracle.apps.fnd.framework.toolbox.schema.server;

import oracle.apps.fnd.framework.server.OAViewObjectImpl;
import oracle.apps.fnd.common.VersionInfo;
//  ---------------------------------------------------------------
//  ---    File generated by Oracle Business Components for Java.
//  ---------------------------------------------------------------
// javadoc_private

public class LookupCodeVVOImpl extends OAViewObjectImpl {

  public static final String RCS_ID="$Header: LookupCodeVVOImpl.java 120.2 2006/07/03 19:53:25 atgops1 noship $";
  public static final boolean RCS_ID_RECORDED =
        VersionInfo.recordClassVersion(RCS_ID, "oracle.apps.fnd.framework.toolbox.schema.server");

  public void initQuery(String lookupCode, String lookupType)
  {
    setWhereClauseParams(null); // Always reset
    setWhereClauseParam(0, lookupCode);
    setWhereClauseParam(1, lookupType);
    executeQuery();

  }
  
  /**
   * 
   * This is the default constructor (do not remove)
   */
  public LookupCodeVVOImpl()
  {
  }
}