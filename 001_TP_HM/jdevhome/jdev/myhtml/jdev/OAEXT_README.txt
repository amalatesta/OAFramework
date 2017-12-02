------------------------------------------------------------------------------
README CONTENTS:
------------------------------------------------------------------------------
A. Patch Description
B. Prerequisites
C. Best Practices
D. Installation Steps
E. Other Information Sources


------------------------------------------------------------------------------
A. PATCH DESCRIPTION:
------------------------------------------------------------------------------

This ARU delivers Oracle10g JDeveloper with OA Extension. This release of 
JDeveloper and the OA Extension are designed to be used with Oracle Applications
Release 12.1.3. Please refer to Metalink Note 564540.1 for information on 
upgrading to E-Business Suite 12.1.

IMPORTANT NOTE: 
No other release or version of Oracle JDeveloper is supported for 
developing extensions intended for deployment to an Oracle Applications R12.1.3
environment.

------------------------------------------------------------------------------
B. PREREQUISITES:
------------------------------------------------------------------------------

1. 8919491  - R12.1.3 for ATG Product Family(R12.ATG_PF.B.DELTA.3)


Hardware and software requirements:

1. Operating Systems: Windows 2000-SP4 or Windows XP-SP2, Linux
2. Preferred Web Browser: Internet Explorer 6.0 or later
3. CPU Type and Speed: Pentium IV 2 GHz or greater
4. Memory: 1 GB RAM 
5. Display: 65536 colors, set to at least 1024 X 768 resolution
6. Disk Space: 575 MB 

IMPORTANT NOTE: 
Client operating systems other than those listed above are not supported for 
use with this release of JDeveloper.

------------------------------------------------------------------------------
C. BEST PRACTICES:
------------------------------------------------------------------------------

Oracle recommends that you:

1. First install and test any patch on a non-production environment, prior to 
    deploying the patch to a production environment.
2. Read the entire content of the corresponding README file before applying a patch.
3. Ensure that Internet Explorer 6.0 or later is your default web browser.

------------------------------------------------------------------------------
D. INSTALLATION STEPS:
------------------------------------------------------------------------------

1. Unzip the accompanying zip file to a directory of your choice (see **NOTE below) on your 
   client machine, which creates the following directory structure 
   under your <jdev_install_dir>:

   jdevbin\
   jdevdoc\
   jdevhome\
   
   **NOTE: The installation directory to which you are unzipping this file must NOT contain 
spaces.
   E.g. Do not unzip to C:\Program Files\jdeveloper. 

  
2. For convenient access to startup the IDE, create a desktop shortcut
    to the JDeveloper executable located at:

    <jdev_install_dir>\jdevbin\jdev\bin\jdevw.exe

    Do NOT launch JDeveloper at this time. Proceed to Step 3 below.


3. To setup and test your development environment access the chapter on
    'Setting Up Your Development Environment' in the Oracle Applications 
    Framework Developer's Guide from the following location:

   <jdev_install_dir>\jdev\doc\devguide\gs\gs_setup.htm#aru

   Follow the instructions and complete all of the steps under the section titled:
   'You are Customer, Consultant or Support Representative'

   To ensure your setup is correct, you should complete the verification 
   steps described under 'Task 6: Test your Setup'.


------------------------------------------------------------------------------
E. LICENSING INFORMATION 
------------------------------------------------------------------------------
The OA Extension is available with this specific version of JDeveloper 10g and is 
bundled for customers on Metalink.No additional licensing is required for Oracle 
Applications Framework Extension beyond the standard Oracle JDeveloper licensing 
and E-Business Suite licensing (at least one E-Business Suite module). 

The Oracle Applications Framework Extension requires the E-Business Suite for 
operation and cannot be used without the suite.


------------------------------------------------------------------------------
F. OTHER INFORMATION SOURCES
------------------------------------------------------------------------------

1. Prior to commencing work on any extension project, we strongly recommend 
    that you review the following documents
		
    Oracle Application Framework Support Guidelines for Customers (Metalink Note 395441.1)


2. For a complete listing of supporting documentation for Release 12.1 of 
    the Oracle Applications Framework, please review Metalink Note: 565870.1 

    
3. Oracle University offers Instructor Led Training classes on the use of 
    Oracle10g JDeveloper with the OA Extension. More information on this class 
    is available at the following URL:

    
http://education.oracle.com/web_prod-plq-dad/plsql/show_desc.redirect?dc=D17314GC10&p_org_id=
1001&lang=US&source_call=

------------------------------------------------------------------------------
Oracle is a registered trademark of Oracle Corporation. 
Copyright © 2006,2007,2008 Oracle Corporation. All rights reserved. 

