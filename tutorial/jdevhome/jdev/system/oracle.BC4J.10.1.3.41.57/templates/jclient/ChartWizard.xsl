
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
   <xsl:output method="text" indent="yes" omit-xml-declaration="yes"/>
   <xsl:strip-space elements="*"/>

<!-- debug
<xsl:message>===================</xsl:message>    
<xsl:message>generateSingleSeriesBinding called</xsl:message>
-->
       
<!--
     // generateImports
 -->

<xsl:template name="generateImports">
   <xsl:param name="packageName" />
   <xsl:text>package </xsl:text>
<xsl:value-of select="$packageName" />;
<xsl:text>
import java.awt.*;
import javax.swing.*;

import oracle.dss.graph.Graph;
import oracle.dss.graph.gui.GraphToolBar;

import oracle.jbo.uicli.binding.*;
import oracle.jbo.uicli.jui.*;
import oracle.jbo.uicli.controls.*;
</xsl:text>
</xsl:template>


<!--
     // generateClassDecl
 -->
<xsl:template name="generateClassDecl">
<xsl:param    name="classname" />
<xsl:text>
public class </xsl:text><xsl:value-of select="$classname"/><xsl:text> extends javax.swing.JPanel 
    implements JClientPanel {</xsl:text>
</xsl:template>

<!--
	stringisize
-->
<xsl:template name="stringisize">
  <xsl:param name="arg"/>
  <xsl:text>&#34;</xsl:text><xsl:value-of select="$arg" /><xsl:text>&#34;</xsl:text>
</xsl:template>

<!--
     // generateInstanceVariables
 -->
<xsl:template name="generateInstanceVariables">
<xsl:param name="dataDefName" />


<xsl:text>
  private BorderLayout panelLayout = new BorderLayout();
  private Graph graph = new Graph();
  private JUApplication app = null;
</xsl:text>


<xsl:variable name="decoratedDataDefName">
  <xsl:call-template name="stringisize">
	<xsl:with-param name="arg" select="$dataDefName" />
  </xsl:call-template>
</xsl:variable>


<xsl:text>
  private JUPanelBinding panelBinding = new JUPanelBinding(</xsl:text><xsl:value-of select="$decoratedDataDefName"/><xsl:text> ,null);
</xsl:text>

<xsl:text>
  JPanel toolsPanel = new JPanel();
  GraphToolBar graphToolBar = new GraphToolBar(graph);
</xsl:text>
</xsl:template>


<!--
   //generateEmptyConstructor
-->
<xsl:template name="generateEmptyConstructor">
<xsl:param name="classname"/>

<xsl:text>  
  public </xsl:text><xsl:value-of select="$classname" />() <xsl:text>{
    
  }
</xsl:text>

</xsl:template>

<!--
   //generateConstructorWithApp
-->
<xsl:template name="generateConstructorWithApp">
<xsl:param name="classname"/>

<xsl:text>  
  public </xsl:text><xsl:value-of select="$classname" />(JUApplication appIn) <xsl:text>{
      
      this(appIn, true);
    
  }
</xsl:text>

</xsl:template>



<!--
   //generateConstructorWithExec
-->
<xsl:template name="generateConstructorWithExec">
<xsl:param name="classname"/>

<xsl:text>  
  public </xsl:text><xsl:value-of select="$classname" />(JUApplication appIn, boolean execute) <xsl:text>{
      
    app = appIn;
    
    try
    {
      if (panelBinding != null)
      {
        panelBinding.setApplication(app);
      }
      jbInit();
      if (execute)
      {
        panelBinding.executeIfNeeded();
      }
    }
    catch(Exception ex)
    {
      ex.printStackTrace();
    }

    
  }
</xsl:text>

</xsl:template>



<!--
   //generateConstructorWithBinding
-->
<xsl:template name="generateConstructorWithBinding">
<xsl:param name="classname"/>

<xsl:text>  
  public </xsl:text><xsl:value-of select="$classname" />(JUPanelBinding binding) <xsl:text>{
    app = binding.getApplication();
    
    setPanelBinding(binding);  
  }
</xsl:text>

</xsl:template>


<!-- 
    // generateSeriesBinding
-->
<xsl:template name="generateSeriesBinding">
   <xsl:param name="graphView" />
   <xsl:param name="labelView" />
   <xsl:param name="iterName" />
   <xsl:param name="attrColumnNames"/>
   <xsl:param name="groupColumnName"/>
   <xsl:param name="seriesLabel"/>
   <xsl:param name="seriesType"/>
   <xsl:param name="chartTypeAsString" />
   
    

<xsl:variable name="decoratedGraphView">
  <xsl:call-template name="stringisize">
	<xsl:with-param name="arg" select="$graphView" />
  </xsl:call-template>
</xsl:variable>

<xsl:variable name="decoratedLabelView">
  <xsl:call-template name="stringisize">
	<xsl:with-param name="arg" select="$labelView" />
  </xsl:call-template>
</xsl:variable>



<xsl:variable name="decoratedGroupColumnName">
  <xsl:call-template name="stringisize">
	<xsl:with-param name="arg" select="$groupColumnName" />
  </xsl:call-template>
</xsl:variable>

<xsl:variable name="decoratedSeriesLabel">
  <xsl:call-template name="stringisize">
	<xsl:with-param name="arg" select="$seriesLabel" />
  </xsl:call-template>
</xsl:variable>

     

<xsl:variable name="decoratedSingleSeriesIterName">
  <xsl:call-template name="stringisize">
	<xsl:with-param name="arg" select="concat($graphView,'Iter')" />
  </xsl:call-template>
</xsl:variable>

<xsl:variable name="decoratedMutliSeriesIterName">
  <xsl:call-template name="stringisize">
	<xsl:with-param name="arg" select="concat($labelView,'Iter')" />
  </xsl:call-template>
</xsl:variable>

 <xsl:if test="$seriesType='SingleSeries'">
    <xsl:text>    
    JUSingleTableGraphBinding  model = JUSingleTableGraphBinding.getInstance(
          panelBinding,
          graph,</xsl:text>JUSingleTableGraphBinding.<xsl:value-of select="$chartTypeAsString"/>,
          <xsl:value-of select="$decoratedGraphView"/><xsl:text>,
          null,</xsl:text>
          <xsl:value-of select="$decoratedSingleSeriesIterName"/><xsl:text>,</xsl:text>
          <xsl:text>new String[] { </xsl:text><xsl:value-of select="$attrColumnNames"/><xsl:text>},</xsl:text><xsl:value-of select="$decoratedGroupColumnName"/><xsl:text>);</xsl:text>
 </xsl:if>
 
 <xsl:if test="$seriesType='MultiSeries'">
    <xsl:text>    
    JUMasterDetailGraphBinding model = JUMasterDetailGraphBinding.getInstance(
         panelBinding,
         graph,</xsl:text>JUMasterDetailGraphBinding.<xsl:value-of select="$chartTypeAsString"/>,
         <xsl:value-of select="$decoratedLabelView"/><xsl:text>,
         null,</xsl:text>					
         <xsl:value-of select="$decoratedMutliSeriesIterName"/><xsl:text>,
	 </xsl:text>
	 <xsl:value-of select="$decoratedSeriesLabel"/><xsl:text>,
	 </xsl:text><xsl:value-of select="$decoratedGraphView"/><xsl:text>,</xsl:text>
         <xsl:text>new String[] { </xsl:text><xsl:value-of select="$attrColumnNames"/><xsl:text>},</xsl:text>
         <xsl:value-of select="$decoratedGroupColumnName"/>);
 </xsl:if>


</xsl:template>


<!-- 
    // generateMultiSeriesBinding
-->
<xsl:template name="generateMultiSeriesBinding">
</xsl:template>


<!--
   //generateJbInit
-->
<xsl:template name="generateJbInit">

	<xsl:param name="seriesType"/>
	<xsl:param name="graphView" />
	<xsl:param name="labelView" />
	<xsl:param name="iterName" />
	<xsl:param name="attrColumnNames"/>
	<xsl:param name="groupColumnName"/>
	<xsl:param name="seriesLabel"/>
	<xsl:param name="chartType"/>
	<xsl:param name="chartTypeAsString"/>

<xsl:text>
  private void jbInit() throws Exception {
    
    //panel setup
    
    this.setLayout(panelLayout);
    add(graph, BorderLayout.CENTER);
    add(toolsPanel, BorderLayout.NORTH);
    graphToolBar.setOrientation(SwingConstants.HORIZONTAL);
    
    toolsPanel.setLayout( new FlowLayout());
    toolsPanel.add( graphToolBar);
</xsl:text>    

    // Graph setup    
	<xsl:call-template name="generateSeriesBinding">
	   <xsl:with-param name="seriesType" select="$seriesType" />
	   <xsl:with-param name="graphView" select="$graphView" />
	   <xsl:with-param name="labelView" select="$labelView" />
	   <xsl:with-param name="iterName" select="$iterName"/>
	   <xsl:with-param name="attrColumnNames" select="$attrColumnNames"/>
	   <xsl:with-param name="groupColumnName" select="$groupColumnName"/>
	   <xsl:with-param name="seriesLabel" select="$seriesLabel"/>
	   <xsl:with-param name="chartTypeAsString" select="$chartType" />
	</xsl:call-template>
    
<xsl:text>
    graph.setDataSource(model);
    
   }
</xsl:text>

</xsl:template>


<!--
   //generateJClientPanelImpl
-->
<xsl:template name="generateJClientPanelImpl">
  <xsl:text>

  /**
  * 
  * JClientPanel implementation
  */
  public JUPanelBinding getPanelBinding()
  {
    return panelBinding;
  }


  public void setPanelBinding(JUPanelBinding binding)
  {
    if (panelBinding == null || panelBinding.getPanel() == null)
    {
      try
      {
        panelBinding = binding;
        panelBinding.setPanel(this);
        jbInit();
      }
      catch(Exception ex)
      {
      }
    }
  }
  </xsl:text>    

</xsl:template>



<!--
   //generateMain
-->
<xsl:template name="generateMain">
  <xsl:param name="classname"/>
  <xsl:text>
  public static void main(String [] args)
  {
    try
    {
      UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
    }
    catch(Exception exemp)
    {
      exemp.printStackTrace();
    }
  </xsl:text>
     
     <xsl:value-of select="$classname" /><xsl:text> panel = new </xsl:text><xsl:value-of select="$classname" /><xsl:text>();
  
    JUTestFrame.testJClientPanel(panel, panel.getPanelBinding(), new Dimension(600, 400));
  }
  </xsl:text>    

</xsl:template>



<!--
   // closeClassDecl
-->
<xsl:template name="closeClassDecl">

<xsl:text>
}
</xsl:text>

</xsl:template>


<xsl:template match="/">

     <xsl:call-template  name="generateImports">
	<xsl:with-param name="packageName" select="/PageWizard/NameSelectPanel/PackageName"/>
    </xsl:call-template>

    <xsl:call-template  name="generateClassDecl">

        <xsl:with-param name="classname" select="/PageWizard/NameSelectPanel/ClassName"/>

    </xsl:call-template>

    <xsl:call-template name="generateInstanceVariables" >

       <xsl:with-param name="dataDefName" select="/PageWizard/DataDefNamePanel/ClientModelFullName"/>
    </xsl:call-template>
    
    <xsl:call-template name="generateEmptyConstructor" >
       <xsl:with-param name="classname" select="/PageWizard/NameSelectPanel/ClassName"/>
    </xsl:call-template>
    
    <xsl:call-template name="generateConstructorWithApp">
	<xsl:with-param name="classname" select="/PageWizard/NameSelectPanel/ClassName"/>
    </xsl:call-template>
    
     <xsl:call-template name="generateConstructorWithExec">
	<xsl:with-param name="classname" select="/PageWizard/NameSelectPanel/ClassName"/>
    </xsl:call-template>
    
    <xsl:call-template name="generateConstructorWithBinding" >
       <xsl:with-param name="classname" select="/PageWizard/NameSelectPanel/ClassName"/>
    </xsl:call-template>



    <xsl:call-template name="generateJbInit" >
       <xsl:with-param name="seriesType" select="/PageWizard/SeriesTypePanel/SeriesType"/>
       <xsl:with-param name="graphView" select="/PageWizard/SeriesTypePanel/GraphView" />
       <xsl:with-param name="iterName" select="/PageWizard/SeriesTypePanel/GraphView" />
       <xsl:with-param name="labelView" select="/PageWizard/SeriesTypePanel/LabelView" />
       <xsl:with-param name="attrColumnNames" select="/PageWizard/ColumnSelectPanel/DataValueAttrList"/>
       <xsl:with-param name="groupColumnName" select="/PageWizard/ColumnSelectPanel/GroupLabel"/>
       <xsl:with-param name="seriesLabel" select="/PageWizard/ColumnSelectPanel/SeriesLabel"/>
       <xsl:with-param name="chartType" select="/PageWizard/ChartTypePanel/ChartTypeAsString"/>
    </xsl:call-template>
    

    <xsl:variable name="generateMain"><xsl:value-of select="/PageWizard/NameSelectPanel/GenerateMain" /></xsl:variable>
    
    <xsl:if test="$generateMain='true'">
        <xsl:call-template name="generateMain">
           <xsl:with-param name="classname" select="/PageWizard/NameSelectPanel/ClassName"/>   
        </xsl:call-template>
    </xsl:if>
    
    <xsl:call-template name="generateJClientPanelImpl" />
    <xsl:call-template name="closeClassDecl" />
    
</xsl:template>

</xsl:stylesheet>
