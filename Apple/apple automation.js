// Clear console
var bt = new BridgeTalk();
bt.target = 'estoolkit-4.0';
bt.body = function(){
    app.clc();
    }.toSource()+"()";
bt.send(5);

if (isOSX())
{
        // House Keeping for wrunning the script on OSX
        // Get Relative Folder location. This ensures that the script can run anywhere, in particular when shared on Creative Cloud.
        var relativePath = getRelativePath();

        $.writeln ( "Based from Relative Path = " + relativePath);


        // Remove default "Output" Folder,, ready for new output content
        // If you would like to keep the old contents, rename the OUTPUT folder before running the script
        deleteFolderAndContents(relativePath+"Output");
        deleteFolderAndContents(relativePath+"ROLLEROutput");
        deleteFolderAndContents(relativePath+"WHITETAILOutput");

        // Create a new Output folder for storing contents of the automation

        createFolder(relativePath+"/Output");
        createFolder(relativePath+"/Output/Country");
        createFolder(relativePath+"/ROLLEROutput");
        createFolder(relativePath+"/ROLLEROutput/Country/");
        createFolder(relativePath+"/WHITETAILOutput");
        createFolder(relativePath+"/WHITETAILOutput/Country/");


        // Make sure that everything is in the correct place
        // Needs to be implemented

        // Ask user to select the processing file
        var csvFile = File.openDialog('Select a CSV File', function (f) { return (f instanceof Folder) || f.name.match(/\.csv$/i);} );
} else
{
    // Windows Processing - Needs to be completed, if required.
    var csvFile = File.openDialog('Select a CSV File','comma-separated-values(*.csv):*.csv;');
}
        app.preferences.autoUpdateOpenDocuments=true;

        // Set up global variables
        var numberOfLayersFound;
        var rollingcoreLocation = "";
        var coreLocation = "";
        var outputLocation = "";
        var rollingoutputLocation = "";
        // set up global array for layer names in a document
        var layerNamesGlobalArray = new Array();
        var layerNamesWTGlobalArray = new Array();
        var PNG_MAX = 0;

if (csvFile != null)
{
    fileArray = readInCSV(csvFile,relativePath);
}


function readInCSV(fileObj,relativePath)
{


        coreLocation = relativePath +"/Layout/static/";
        outputLocation = relativePath + "Output/Country/";
        rollingcoreLocation = relativePath+"/Layout/Rolling/";
        rollingoutputLocation = relativePath+"/ROLLEROutput/Country/";
        whitetailcoreLocation = relativePath+"/Layout/WhiteTail/";
        whitetailoutputLocation = relativePath+"WHITETAILOutput/Country/";


    // Objective. This script has been creted after working with Rosie Summons to define the best use of the creative time, reduce friction with getting files to freelancers, and reducing manual effort. Desginers will be ablle
    // to focus back on design and allow the script to automate the workflow. This should reduce the time taken to create assets from 5 days to a few hours.
    // with 5 counties it takes 1 desginer 5 days. with 11, will take 2 designers 5 days and 23 will take 4 designers 5 days.
    // Desginers work on the core files for each campaign, residing under
       //  STATIC
       //   ROLLING
    // Files are processed by this script. the content to be processed is defined wihin main / ProcessAll V1.csv
     /// ---- This reads the CSV file, (main / ProcessAll V1.csv)  line by line and processes the records
     // There is a structure to the file
     // Country Code lines - COUNTRY|India ("|" is used to define the country code on the country definition
     // Entries for the 3Device are controlled by the Static indicator
     /// STATIC,StaticLeft.psd,,StaticRight.psd, Millions of tracks~available whenever you~want. wherever you are.,Try Apple Music free for 3-months., Terms Apply.
    // Position 1 - PSD file that is used to reference the left image on a 3 device campaign
    // position 2 - PSD file that is used for the Middle of a 3 Device Campaign
    // Position 3 - PSD file that is used for the Right of a 3 Device campaign
    // Each file defined is locaisaed by country. Files are located in the /Static/ foldler then country folder
    // Positions 4 to 6 are the text for the campaign, new line is defined with a "~" mark and will be substituted in Photoshop at run time.

    //    The point of the script is to :-
    // 1. Remove unnecasasry repatative tasks - like Updating core image assets for each country, Text insertions for each country
    // 2. Focus the desinger on the artwork, rather than repetative tasks
    // 3. Make it easy for a freelancer to engage using Creative Cloud as a sharing and Collabroation mechanism
    // 4. Allow Fetch to scale. Currently there are 5 countries, this sctript will allow scaling of countries (possibly due for 2017), without impacting on the resources that Fetch have
    // 5. Reduce costs associated with resources and freelancers
    // 6. Support random image and copy changes from the customer at any time, there fore should reduce the pressure of delivery if they are delivered late
    // 7. Provide a way to centralise the Work in progress elemnets of the job
    // 8 Reduce the time for creation of assets from 5 days to under a day
    // Dependencies
    //  Rather than investing in more frelancers and desginers to do manual tasks (not graphics related), resoures in a developer to create the required scripts to harnes Photoshop for this type of processing.
    //  THe Script (.JSX file) should sit with the other pices of the job.

    // Processing
    // For each job  received by Rosie.
    // 1. A creative cloud folder set up
    // 2. Place the Core components (Script and folder structure etc from the Fetch shared drive
    // 3. Create the Breif
    // 4. Create the CSV file with the copy in it (Scott Hemmens might have another idea for this
    // 5. Place images in the right places in the file structure for each country. These will be worked on by the designer before the script runs
    // 6. Freelancer / Designer works on the artwork only and inserts into each Left, Middle and Right PSD file (defined in the CSV file
    // 7. Make sure COPY is inserted in the CSV file
    // 8. Run the Script for each campaign type.

//    Annotations
// 24th April - Rcurtis - MOdifed to specify the PSD on the country code element
// 19th May 2017 - RC006 - modified code to show dialog for any SaveforWeb (Legacy) commands, this will give control over the output size.
//                    - Added the file name to open for each static file (posiiton 1 of the array, everything shifted+1 )
 //                 - Added spec for maxinium file size of the output, based on file type (MOV /

     var fileArray = new Array();
                        // RC  - 24/04/2017
     var currentStaticPSD=null;
     okToContinue = true;
     fileObj.open('r');
     fileObj.seek(0, 0);

// Read CSV file until eod of file is reached

     while(!fileObj.eof)
     {
          var thisLine = fileObj.readln();
          // Manage Breaks by Country, defined by the pipe deliiter
          var splitvalue = thisLine.indexOf("|") ;
          $.writeln ( "thisLine"+thisLine);
         if (splitvalue>0) {
             // If a country code split is defined then start the next country processing
             var countryCode = thisLine.split('|');
             $.writeln ( "Managing Country Code " +countryCode[1]);
             // RC006 - Get new max KB size values
             var MOV = countryCode[2].split(':');
             var MOV_MAX = MOV[1]*1000;
             var GIF = countryCode[3].split(':');
             var GIF_MAX = GIF[1]*1000;
             var PNG = countryCode[4].split(':');
             PNG_MAX = PNG[1]*1000;
             $.writeln ( "MOV MAX"+MOV_MAX);
            $.writeln ( "GIF MAX"+GIF_MAX);
            $.writeln ( "PNG_MAX"+PNG_MAX);
                        // RC  - 24/04/2017
            // RC006 currentStaticPSD = countryCode[2];
             //Create country code folder for the country being processed, this will store the output for the country, this should help delivery to the customer

              } else {
                   // Otherwuse it's static or Rolling or White Tail data
              $.writeln ( "Managing Data " + thisLine);
              okToContinue = true;
                var csvArray = thisLine.split(';');
                // Process Static only
                // Three definitions for the processing STATIC ,  ROLLING, WHITETAIL needs to be added (is in the CSV file, not here).
                // False = True will stop this function running temporarily
                $.writeln("csvarray = " +csvArray[0]);
                $.writeln("looking for STATIC");
                if (csvArray[0] == "STATIC") {
                    // Create folder for each country
                    createFolder(relativePath+"/Output/Country/"+countryCode[1]);

                // okToContinue is a fail safe and will continue with the script in case of an error, errors are captured in the console, but can easily moved to a text file
                // Process STATIC will process the static campaigns for each country. Within each country there are multiple artboards (ecxorted as .PNG)
                // RC0006 - Added CSV Array 7
                //                    okToContinue = processSTATIC(relativePath, coreLocation, countryCode[1], csvArray[1], csvArray[2], csvArray[3], csvArray[4], csvArray[5], csvArray[6] );
                $.writeln ( "Processing country "+ countryCode[1] + " csv array 2 = " +csvArray[2] );
                    okToContinue = processSTATIC(relativePath, coreLocation, countryCode[1], csvArray[1], csvArray[2], csvArray[3], csvArray[4], csvArray[5], csvArray[6],csvArray[7], );
                // RC0006 ////////


                    if (okToContinue) {
                        // if entry was processed abovem, then save the file to the output location + country code
                        // Save current file to the country code folder described in the CSV file.- Code taken from the Listner action in PS (Just modified to be dynamic on the file names)

                        saveFile(outputLocation,countryCode[1]);
                        // Export artboards relies on Photoshop export artboard function and will require the operator to add the country to the location, and to press enter to continue and accept OK when complete
                        exportArtboards();
                        // Close document and get ready for next
                        closeDocument();
                        /////////
                        //RC 006 - Open the documents that are images and over the MAX values from the CSV file
                        ////////
                        // Processing will, after the artboards have been processed, read any files that are under the image size for PNG and JPG
                        $.writeln ( "RC006 - opening files in location  " + outputLocation,countryCode[1]);

                        processBigImageFiles(outputLocation+countryCode[1],PNG_MAX);
                        ////////
                    }

                    // =======================================================


                //Processing WHITETAIL
                }
                $.writeln("looking for WHITETAIL");
                 if (csvArray[0] == "WHITETAIL") {
                     $.write("RUNNING WhiteTail");
                    createFolder(relativePath+"/WHITETAILOutput/Country/"+countryCode[1]);

                    okToContinue = processWHITETAIL(relativePath, coreLocation, countryCode[1], csvArray[1], csvArray[2], csvArray[3], csvArray[4], csvArray[5], csvArray[6] );

                    if (okToContinue) {
                        // if entry was processed above, then save the file to the output location + country code
                        // Save current file to the country code folder described in the CSV file.- Code taken from the Listner action in PS (Just modified to be dynamic on the file names)

                        saveFile(whitetailoutputLocation,countryCode[1]);
                        // Export artboards relies on Photoshop export artboard function and will require the operator to add the country to the location, and to press enter to continue and accept OK when complete
                        exportArtboards();
                        // Close document and get ready for next
                        closeDocument();

                        // RC006 - Open each file and close once the SAvef=forweb has completed.
                       $.writeln ( "RC006 - opening Whitetail files in location  " + whitetailoutputLocation,countryCode[1]);

                        processBigImageFiles(whitetailoutputLocation+countryCode[1],PNG_MAX);

                    }
                 }

                // Processing ROLLING - Video export formats (MOV and GIF)
                 if (csvArray[0] == "ROLLER") {
                        $.write("RUNNING Roller");
                        // Create output folder for each rolling country
                        createFolder(relativePath+"/Output/Country/"+countryCode[1]);
                        createFolder(relativePath+"/ROLLEROutput/Country/"+countryCode[1]+"/"+csvArray[1]);
                        // Values within the CSV file
                        //position 1 = size of rolling canvas
                        // position 2 = left image placeholder name
                        // position 3 = middle image placeholder name
                        // position 4 = right image placeholder name
                        // position 5 = COPY (if needed)
                        // position 6 = CTACopy (if needed)
                        // Position 7 = Terms (if needed)
                        okToContinue = processROLLING(relativePath, rollingcoreLocation, countryCode[1], csvArray[1], csvArray[2], csvArray[3], csvArray[4], csvArray[5], csvArray[6],csvArray[7] );
                        // If record was processed ok, then save file, export MOV and GIF.
                        if (okToContinue) {
                        saveFile(rollingoutputLocation,countryCode[1]+csvArray[1]);
                            // Export movie
                            // =======================================================


                        // export Quick Time MOV. (code extracted from Photoshop)-
                        // =======================================================
                        var idExpr = charIDToTypeID( "Expr" );
                        var desc48 = new ActionDescriptor();
                        var idUsng = charIDToTypeID( "Usng" );
                        var desc49 = new ActionDescriptor();
                        var iddirectory = stringIDToTypeID( "directory" );
                        desc49.putPath( iddirectory, new File(rollingoutputLocation + countryCode[1] +"/"+csvArray[1])  );
                        var idameFormatName = stringIDToTypeID( "ameFormatName" );
                        desc49.putString( idameFormatName, """QuickTime""" );
                        var idamePresetName = stringIDToTypeID( "amePresetName" );
                        desc49.putString( idamePresetName, """Animation High Quality.epr""" );
                        var iduseDocumentSize = stringIDToTypeID( "useDocumentSize" );
                        desc49.putBoolean( iduseDocumentSize, true );
                        var iduseDocumentFrameRate = stringIDToTypeID( "useDocumentFrameRate" );
                        desc49.putBoolean( iduseDocumentFrameRate, true );
                        var idpixelAspectRatio = stringIDToTypeID( "pixelAspectRatio" );
                        var idpixelAspectRatio = stringIDToTypeID( "pixelAspectRatio" );
                        var idDcmn = charIDToTypeID( "Dcmn" );
                        desc49.putEnumerated( idpixelAspectRatio, idpixelAspectRatio, idDcmn );
                        var idfieldOrder = stringIDToTypeID( "fieldOrder" );
                        var idvideoField = stringIDToTypeID( "videoField" );
                        var idpreset = stringIDToTypeID( "preset" );
                        desc49.putEnumerated( idfieldOrder, idvideoField, idpreset );
                        var idmanage = stringIDToTypeID( "manage" );
                        desc49.putBoolean( idmanage, true );
                        var idallFrames = stringIDToTypeID( "allFrames" );
                        desc49.putBoolean( idallFrames, true );
                        var idrenderAlpha = stringIDToTypeID( "renderAlpha" );
                        var idalphaRendering = stringIDToTypeID( "alphaRendering" );
                        var idNone = charIDToTypeID( "None" );
                        desc49.putEnumerated( idrenderAlpha, idalphaRendering, idNone );
                        var idQlty = charIDToTypeID( "Qlty" );
                        desc49.putInteger( idQlty, 1 );
                        var idZthreeDPrefHighQualityErrorThreshold = stringIDToTypeID( "Z3DPrefHighQualityErrorThreshold" );
                        desc49.putInteger( idZthreeDPrefHighQualityErrorThreshold, 5 );
                        var idvideoExport = stringIDToTypeID( "videoExport" );
                        desc48.putObject( idUsng, idvideoExport, desc49 );
                        // RC006
                        //                        executeAction( idExpr, desc48, DialogModes.NO );
                        executeAction( idExpr, desc48, DialogModes.ALL );
                        ///////////////////////

                        // Export GIF
                        //Convert the Time line - Direct from Photoshop
                        // =======================================================
                        var idconvertTimeline = stringIDToTypeID( "convertTimeline" );
                        var desc134 = new ActionDescriptor();
                        executeAction( idconvertTimeline, desc134, DialogModes.NO );
                        // Now save for Web Legacy - Direct from Photoshop
                        // =======================================================
                        var idExpr = charIDToTypeID( "Expr" );
                        var desc108 = new ActionDescriptor();
                        var idUsng = charIDToTypeID( "Usng" );
                        var desc109 = new ActionDescriptor();
                        var idOp = charIDToTypeID( "Op  " );
                        var idSWOp = charIDToTypeID( "SWOp" );
                        var idOpSa = charIDToTypeID( "OpSa" );
                        desc109.putEnumerated( idOp, idSWOp, idOpSa );
                        var idDIDr = charIDToTypeID( "DIDr" );
                        desc109.putBoolean( idDIDr, true );
                        var idIn = charIDToTypeID( "In  " );
                        desc109.putPath( idIn, new File(rollingoutputLocation + countryCode[1] +"/"+csvArray[1]) );
                        var idovFN = charIDToTypeID( "ovFN" );

                        desc109.putString( idovFN, csvArray[1] +".gif" );
                        //desc109.putString( idovFN, """abc.gif""" );
                        var idFmt = charIDToTypeID( "Fmt " );
                        var idIRFm = charIDToTypeID( "IRFm" );
                        var idGIFf = charIDToTypeID( "GIFf" );
                        desc109.putEnumerated( idFmt, idIRFm, idGIFf );
                        var idIntr = charIDToTypeID( "Intr" );
                        desc109.putBoolean( idIntr, false );
                        var idRedA = charIDToTypeID( "RedA" );
                        var idIRRd = charIDToTypeID( "IRRd" );
                        var idFlBs = charIDToTypeID( "FlBs" );
                        desc109.putEnumerated( idRedA, idIRRd, idFlBs );
                        var idFBPl = charIDToTypeID( "FBPl" );
                        desc109.putString( idFBPl, """Mac OS""" );
                        var idRChT = charIDToTypeID( "RChT" );
                        desc109.putBoolean( idRChT, false );
                        var idRChV = charIDToTypeID( "RChV" );
                        desc109.putBoolean( idRChV, false );
                        var idAuRd = charIDToTypeID( "AuRd" );
                        desc109.putBoolean( idAuRd, true );
                        var idNCol = charIDToTypeID( "NCol" );
                        desc109.putInteger( idNCol, 256 );
                        var idDChS = charIDToTypeID( "DChS" );
                        desc109.putInteger( idDChS, 0 );
                        var idDCUI = charIDToTypeID( "DCUI" );
                        desc109.putInteger( idDCUI, 0 );
                        var idDChT = charIDToTypeID( "DChT" );
                        desc109.putBoolean( idDChT, false );
                        var idDChV = charIDToTypeID( "DChV" );
                        desc109.putBoolean( idDChV, false );
                        var idWebS = charIDToTypeID( "WebS" );
                        desc109.putInteger( idWebS, 0 );
                        var idTDth = charIDToTypeID( "TDth" );
                        var idIRDt = charIDToTypeID( "IRDt" );
                        var idNone = charIDToTypeID( "None" );
                        desc109.putEnumerated( idTDth, idIRDt, idNone );
                        var idTDtA = charIDToTypeID( "TDtA" );
                        desc109.putInteger( idTDtA, 100 );
                        var idLoss = charIDToTypeID( "Loss" );
                        desc109.putInteger( idLoss, 0 );
                        var idLChS = charIDToTypeID( "LChS" );
                        desc109.putInteger( idLChS, 0 );
                        var idLCUI = charIDToTypeID( "LCUI" );
                        desc109.putInteger( idLCUI, 100 );
                        var idLChT = charIDToTypeID( "LChT" );
                        desc109.putBoolean( idLChT, false );
                        var idLChV = charIDToTypeID( "LChV" );
                        desc109.putBoolean( idLChV, false );
                        var idTrns = charIDToTypeID( "Trns" );
                        desc109.putBoolean( idTrns, true );
                        var idMtt = charIDToTypeID( "Mtt " );
                        desc109.putBoolean( idMtt, true );
                        var idDthr = charIDToTypeID( "Dthr" );
                        var idIRDt = charIDToTypeID( "IRDt" );
                        var idDfsn = charIDToTypeID( "Dfsn" );
                        desc109.putEnumerated( idDthr, idIRDt, idDfsn );
                        var idDthA = charIDToTypeID( "DthA" );
                        desc109.putInteger( idDthA, 100 );
                        var idMttR = charIDToTypeID( "MttR" );
                        desc109.putInteger( idMttR, 255 );
                        var idMttG = charIDToTypeID( "MttG" );
                        desc109.putInteger( idMttG, 255 );
                        var idMttB = charIDToTypeID( "MttB" );
                        desc109.putInteger( idMttB, 255 );
                        var idSHTM = charIDToTypeID( "SHTM" );
                        desc109.putBoolean( idSHTM, false );
                        var idSImg = charIDToTypeID( "SImg" );
                        desc109.putBoolean( idSImg, true );
                        var idSWsl = charIDToTypeID( "SWsl" );
                        var idSTsl = charIDToTypeID( "STsl" );
                        var idSLAl = charIDToTypeID( "SLAl" );
                        desc109.putEnumerated( idSWsl, idSTsl, idSLAl );
                        var idSWch = charIDToTypeID( "SWch" );
                        var idSTch = charIDToTypeID( "STch" );
                        var idCHsR = charIDToTypeID( "CHsR" );
                        desc109.putEnumerated( idSWch, idSTch, idCHsR );
                        var idSWmd = charIDToTypeID( "SWmd" );
                        var idSTmd = charIDToTypeID( "STmd" );
                        var idMDCC = charIDToTypeID( "MDCC" );
                        desc109.putEnumerated( idSWmd, idSTmd, idMDCC );
                        var idohXH = charIDToTypeID( "ohXH" );
                        desc109.putBoolean( idohXH, false );
                        var idohIC = charIDToTypeID( "ohIC" );
                        desc109.putBoolean( idohIC, true );
                        var idohAA = charIDToTypeID( "ohAA" );
                        desc109.putBoolean( idohAA, true );
                        var idohQA = charIDToTypeID( "ohQA" );
                        desc109.putBoolean( idohQA, true );
                        var idohCA = charIDToTypeID( "ohCA" );
                        desc109.putBoolean( idohCA, false );
                        var idohIZ = charIDToTypeID( "ohIZ" );
                        desc109.putBoolean( idohIZ, true );
                        var idohTC = charIDToTypeID( "ohTC" );
                        var idSToc = charIDToTypeID( "SToc" );
                        var idOCzerothree = charIDToTypeID( "OC03" );
                        desc109.putEnumerated( idohTC, idSToc, idOCzerothree );
                        var idohAC = charIDToTypeID( "ohAC" );
                        var idSToc = charIDToTypeID( "SToc" );
                        var idOCzerothree = charIDToTypeID( "OC03" );
                        desc109.putEnumerated( idohAC, idSToc, idOCzerothree );
                        var idohIn = charIDToTypeID( "ohIn" );
                        desc109.putInteger( idohIn, -1 );
                        var idohLE = charIDToTypeID( "ohLE" );
                        var idSTle = charIDToTypeID( "STle" );
                        var idLEzerothree = charIDToTypeID( "LE03" );
                        desc109.putEnumerated( idohLE, idSTle, idLEzerothree );
                        var idohEn = charIDToTypeID( "ohEn" );
                        var idSTen = charIDToTypeID( "STen" );
                        var idENzerozero = charIDToTypeID( "EN00" );
                        desc109.putEnumerated( idohEn, idSTen, idENzerozero );
                        var idolCS = charIDToTypeID( "olCS" );
                        desc109.putBoolean( idolCS, false );
                        var idolEC = charIDToTypeID( "olEC" );
                        var idSTst = charIDToTypeID( "STst" );
                        var idSTzerozero = charIDToTypeID( "ST00" );
                        desc109.putEnumerated( idolEC, idSTst, idSTzerozero );
                        var idolWH = charIDToTypeID( "olWH" );
                        var idSTwh = charIDToTypeID( "STwh" );
                        var idWHzeroone = charIDToTypeID( "WH01" );
                        desc109.putEnumerated( idolWH, idSTwh, idWHzeroone );
                        var idolSV = charIDToTypeID( "olSV" );
                        var idSTsp = charIDToTypeID( "STsp" );
                        var idSPzerofour = charIDToTypeID( "SP04" );
                        desc109.putEnumerated( idolSV, idSTsp, idSPzerofour );
                        var idolSH = charIDToTypeID( "olSH" );
                        var idSTsp = charIDToTypeID( "STsp" );
                        var idSPzerofour = charIDToTypeID( "SP04" );
                        desc109.putEnumerated( idolSH, idSTsp, idSPzerofour );
                        var idolNC = charIDToTypeID( "olNC" );
                        var list3 = new ActionList();
                        var desc110 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCzerozero = charIDToTypeID( "NC00" );
                        desc110.putEnumerated( idncTp, idSTnc, idNCzerozero );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list3.putObject( idSCnc, desc110 );
                        var desc111 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNConenine = charIDToTypeID( "NC19" );
                        desc111.putEnumerated( idncTp, idSTnc, idNConenine );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list3.putObject( idSCnc, desc111 );
                        var desc112 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwoeight = charIDToTypeID( "NC28" );
                        desc112.putEnumerated( idncTp, idSTnc, idNCtwoeight );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list3.putObject( idSCnc, desc112 );
                        var desc113 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwofour = charIDToTypeID( "NC24" );
                        desc113.putEnumerated( idncTp, idSTnc, idNCtwofour );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list3.putObject( idSCnc, desc113 );
                        var desc114 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwofour = charIDToTypeID( "NC24" );
                        desc114.putEnumerated( idncTp, idSTnc, idNCtwofour );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list3.putObject( idSCnc, desc114 );
                        var desc115 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwofour = charIDToTypeID( "NC24" );
                        desc115.putEnumerated( idncTp, idSTnc, idNCtwofour );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list3.putObject( idSCnc, desc115 );
                        desc109.putList( idolNC, list3 );
                        var idobIA = charIDToTypeID( "obIA" );
                        desc109.putBoolean( idobIA, false );
                        var idobIP = charIDToTypeID( "obIP" );
                        // chnanged xx
                        desc109.putString( idobIP, "" );
                        var idobCS = charIDToTypeID( "obCS" );
                        var idSTcs = charIDToTypeID( "STcs" );
                        var idCSzeroone = charIDToTypeID( "CS01" );
                        desc109.putEnumerated( idobCS, idSTcs, idCSzeroone );
                        var idovNC = charIDToTypeID( "ovNC" );
                        var list4 = new ActionList();
                        var desc116 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCzeroone = charIDToTypeID( "NC01" );
                        desc116.putEnumerated( idncTp, idSTnc, idNCzeroone );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc116 );
                        var desc117 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwozero = charIDToTypeID( "NC20" );
                        desc117.putEnumerated( idncTp, idSTnc, idNCtwozero );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc117 );
                        var desc118 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCzerotwo = charIDToTypeID( "NC02" );
                        desc118.putEnumerated( idncTp, idSTnc, idNCzerotwo );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc118 );
                        var desc119 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNConenine = charIDToTypeID( "NC19" );
                        desc119.putEnumerated( idncTp, idSTnc, idNConenine );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc119 );
                        var desc120 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCzerosix = charIDToTypeID( "NC06" );
                        desc120.putEnumerated( idncTp, idSTnc, idNCzerosix );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc120 );
                        var desc121 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwofour = charIDToTypeID( "NC24" );
                        desc121.putEnumerated( idncTp, idSTnc, idNCtwofour );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc121 );
                        var desc122 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwofour = charIDToTypeID( "NC24" );
                        desc122.putEnumerated( idncTp, idSTnc, idNCtwofour );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc122 );
                        var desc123 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwofour = charIDToTypeID( "NC24" );
                        desc123.putEnumerated( idncTp, idSTnc, idNCtwofour );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc123 );
                        var desc124 = new ActionDescriptor();
                        var idncTp = charIDToTypeID( "ncTp" );
                        var idSTnc = charIDToTypeID( "STnc" );
                        var idNCtwotwo = charIDToTypeID( "NC22" );
                        desc124.putEnumerated( idncTp, idSTnc, idNCtwotwo );
                        var idSCnc = charIDToTypeID( "SCnc" );
                        list4.putObject( idSCnc, desc124 );
                        desc109.putList( idovNC, list4 );
                        var idovCM = charIDToTypeID( "ovCM" );
                        desc109.putBoolean( idovCM, false );
                        var idovCW = charIDToTypeID( "ovCW" );
                        desc109.putBoolean( idovCW, false );
                        var idovCU = charIDToTypeID( "ovCU" );
                        desc109.putBoolean( idovCU, true );
                        var idovSF = charIDToTypeID( "ovSF" );
                        desc109.putBoolean( idovSF, true );
                        var idovCB = charIDToTypeID( "ovCB" );
                        desc109.putBoolean( idovCB, true );
                        var idovSN = charIDToTypeID( "ovSN" );
                        desc109.putString( idovSN, """images""" );
                        var idSaveForWeb = stringIDToTypeID( "SaveForWeb" );
                        desc108.putObject( idUsng, idSaveForWeb, desc109 );
                        //////////////////////// RC06 - 17th May 2017
                        // removed dialog.NO and replaced with Diallog.ALL - This will give control of the output size
                        // executeAction( idExpr, desc108, DialogModes.NO );
                        executeAction( idExpr, desc108, DialogModes.ALL );
                        ////////////////////////

                        $.write("Video Exported");
                        closeDocument();
                }

            }

    }

}
           fileArray.push(csvArray);


        fileObj.close();



     return fileArray;
}

function isOSX()
{
    return $.os.match(/Macintosh/i);
}


// Select layer
function selectLayer(layerName,whichArray) {
    var okToContinue=true;
    // 1L is the first layer access the glboal array for first level)
    // WT is the white tail layer (access the glboal array for WT)
    findMatchInlayerNamesGlobalArray(layerName, whichArray);

    if (okToContinue) {
                        var idslct = charIDToTypeID( "slct" );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref3 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref3.putName( idLyr, layerName );
    desc3.putReference( idnull, ref3 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc3.putBoolean( idMkVs, false );
    var idLyrI = charIDToTypeID( "LyrI" );
        var list3 = new ActionList();
        list3.putInteger( 311 );
    desc3.putList( idLyrI, list3 );
executeAction( idslct, desc3, DialogModes.NO );

               } else {
                   $.writeln("1...");
                if (whichArray=="1L") {
                    $.writeln("Layer " +layerName+ " Not Found in this document");
                }
                if (whichArray=="WT") {
                    $.writeln("Layer " +layerName+ " Not Found in this WT document");
              }
          }
}

///////////////////////////////////////////////////////////////////////////////
// ReLinkToFile - This function will search for a layer, defined in the CSV file, then update it's contents (Linked Smart Object, from the image location parameter)
///////////////////////////////////////////////////////////////////////////////


function reLinkToFile(layerName,imageLocation, fileName,whichArray) {
                    // Following code came from the Listener
                    // Select the correct layer in the PSD, then update from the designers work
                   // Does the layer exist in the active document
        var okToContinue=true;
        var numberOfLayersFound=0;
        if (fileName!="") {
           okToContinue=findMatchInlayerNamesGlobalArray(layerName,whichArray);
            // if layer name does not exist, then don't continue.
            if (okToContinue) {
                $.writeln("RELINK layer name ="+ layerName);
                //Make sure File actually exists
                if (!File( imageLocation+fileName).exists) {
                    $.writeln("RELINKTOFILE - File Does not Exist"+imageLocation+fileName);
                } else {
                        // Re-link the file to a new file (for the country being processed)- code derived from the Photoshop Listner
                        var idslct = charIDToTypeID( "slct" );
                        var desc33 = new ActionDescriptor();
                        var idnull = charIDToTypeID( "null" );
                        var ref8 = new ActionReference();
                        var idLyr = charIDToTypeID( "Lyr " );

                        ref8.putName( idLyr, layerName);

                        desc33.putReference( idnull, ref8 );
                        var idMkVs = charIDToTypeID( "MkVs" );
                        desc33.putBoolean( idMkVs, false );
                        var idLyrI = charIDToTypeID( "LyrI" );
                        var list8 = new ActionList();
                        list8.putInteger( 10 );
                        desc33.putList( idLyrI, list8 );
                        executeAction( idslct, desc33, DialogModes.NO );

                        var idplacedLayerReplaceContents = stringIDToTypeID( "placedLayerRelinkToFile" );
                        var desc5 = new ActionDescriptor();
                        var idnull = charIDToTypeID( "null" );
                        // Read files from the correct country code, defined from the CSV file.
                        //                    desc5.putPath( idnull, new File( coreLocation+countryCode[1]+csvArray[1] ) );
                        desc5.putPath( idnull, new File( imageLocation +fileName));
                        executeAction( idplacedLayerReplaceContents, desc5, DialogModes.NO );
                 }
               } else {
                   $.writeln("1...");
                $.writeln("Layer " +layerName+ " Not Found in this document");

              }
            }
    }

///////////////////////////////////////////////////////////////////////////////
// writeTexttoLayer - The script processing can replace the contents of text layers by specificing the text in the CSV file
///////////////////////////////////////////////////////////////////////////////
function writeTexttoLayer(layerName,text) {
    // =======================================================
    // Does the layer exist in the active document
    //========================================================
    var okToContinue=false;
       okToContinue =findMatchInlayerNamesGlobalArray(layerName,"1L");

    // RC006 - If text is empty, then don't write the layer
    if (okToContinue && text !="") {

        // function to update a layer with copy - code taken from the Photoshop Listener.
        var idslct = charIDToTypeID( "slct" );
        var desc324 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
        var ref150 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        //        ref150.putName( idLyr, "Terms300x250" );
        ref150.putName( idLyr, layerName );
        desc324.putReference( idnull, ref150 );
        var idMkVs = charIDToTypeID( "MkVs" );
        desc324.putBoolean( idMkVs, false );
        var idLyrI = charIDToTypeID( "LyrI" );
        var list103 = new ActionList();
        list103.putInteger( 568 );
        desc324.putList( idLyrI, list103 );
        executeAction( idslct, desc324, DialogModes.NO );
        $.writeln("RC006 TEXT =" + text);
        app.activeDocument.activeLayer.textItem.contents=text;
        } else {
            $.writeln("2...");
            $.writeln("Layer " +layerName+ " Not Found in this document");
            //okToContinue=false;
        }
    //return okToContinue;
    }
///////////////////////////////////////////////////////////////////////////////
// createNewLines - This function will allow a single line of text to be split across multiple lines in the PSD, by replaceing a special char with CharCode 13 (New line)
///////////////////////////////////////////////////////////////////////////////

function createNewLines(textString) {
    // CSV file does not handle carridge return, so when the code finds a "~" it will substobute into Photoshop a new line.
    var newLineArray = textString.split('~');
    //  $.writeln("new lines length"+newLineArray.length);

  if (newLineArray.length>0) {
    var CopyLinewchr13="";

    for (var m = 0; m < newLineArray.length; m++)
    {
      CopyLinewchr13 = CopyLinewchr13 + newLineArray[m]+String.fromCharCode(13);
     }
    } else {
         CopyLinewchr13 = textString;
     }
    return CopyLinewchr13;
    }

///////////////////////////////////////////////////////////////////////////////
// getRelativePath- The purpose of the script is that it can be run from a shared folder on Creative CLoud, this function will get the local relative folder on the operators system
///////////////////////////////////////////////////////////////////////////////

function getRelativePath() {
        // We need everything to come from where the CSV / Script is run from, so this gets the relative path and works out where things need to be
        // this means that the script can be distributed via Crestive Cloud and anyone can run it and then use the Sync machinsm to get it to people that need the final output at any time
         var ScriptFilePath = Folder($.fileName).parent.fsName ;

         $.write("Current Folder"+Folder($.fileName).parent.fsName);
         var splitFolder=Folder($.fileName).parent.fsName.split("/");
         $.write(splitFolder.length);
        var baseLoc="";
        for (i=0;i<splitFolder.length-3;i++) {
            baseLoc=baseLoc+splitFolder[i]+"/";

       }


return baseLoc;
    }
///////////////////////////////////////////////////////////////////////////////
// deleteFolderAndContents- To make sure the output is clean each time the script runs, this function will read a folder structure and delete the contents.
///////////////////////////////////////////////////////////////////////////////

function deleteFolderAndContents(folderName) {
    // This function makes sure that the output folder and it's contents from the last run are remvoed , before new contents are created.

        $.write("deleting folder and contents " + folderName)
        var aChildren = Folder(folderName).getFiles();

        var aProcessedOBJ=0;

         for (var i = 0; i < aChildren.length; i++) {

                var child = aChildren[i];
                $.writeln ( "child name,"+child.name);
                if (child instanceof Folder) {

                        deleteFolderAndContents(folderName+"/"+child.name);

                    }
              File(folderName+"/"+child.name).remove();


            }
        File(folderName).remove();


    }

///////////////////////////////////////////////////////////////////////////////
// createFolder- Create a new folder
///////////////////////////////////////////////////////////////////////////////

function createFolder(folderName) {
        // Function to create folders on the disk, ready for the output to be created for each run.
     var newOutputFolder = new Folder(folderName);
        newOutputFolder .create();
    }


///////////////////////////////////////////////////////////////////////////////
// processWHITETAIL- Process whitetail PSD files from the CSV file
///////////////////////////////////////////////////////////////////////////////

function processWHITETAIL(relativePath, coreLocation, countryCode1,csvArray1,csvArray2,csvArray3,csvArray4,csvArray5,csvArray6 ) {
            // open the static source document for each  Static Entry (only one static entry) - Taken from the Listener action (not hand coded)
            // =======================================================
            //  var okToContinue = openPSDFile(relativePath, "/Layout/Static/Apple-3294-Deliverables.psd");
           var okToContinue = openPSDFile(relativePath, "/Layout/WhiteTail/" + csvArray1+".psd");

            if (okToContinue) {

            // Static Positional names
            // $.writeln("csv0"+coreLocation);
            // $.writeln("csv1"+countryCode1);
            // $.writeln("csv3"+csvArray4);

            // 480x320
            writeTexttoLayer("Terms480x320",csvArray4);
            writeTexttoLayer("Copy480x320",createNewLines(csvArray2));
            writeTexttoLayer("CTACopy480x320",csvArray3);

            // 300 x 250
            writeTexttoLayer("Terms300x250",csvArray4);
            writeTexttoLayer("Copy300x250",createNewLines(csvArray2));
            writeTexttoLayer("CTACopy300x250",csvArray3);

            // 320 x 480
            writeTexttoLayer("Terms320x480",csvArray4);
            writeTexttoLayer("Copy320x480",createNewLines(csvArray2));
            writeTexttoLayer("CTACopy320x480",csvArray3);

            var layerNameFound = false;
            layerNameFound = findMatchInlayerNamesGlobalArray("Black-Hands","1L");
            // Delete LSO Hands folder under the country
            //$.write("will delete "+relativePath+"/Layout/Whitetail/" + countryCode1 + "/LSO-Hands");
            deleteFolderAndContents(relativePath+"/Layout/Whitetail/" + countryCode1+"/LSO-Hands");
            if (layerNameFound) {
                //process mixed
                selectLayer("Black-Hands",'1L');
                // =======================================================
                // edit contents of the SmartObject - Black Hands
                editSmartObjectContents();
                // load layers for WhiteTail
                loadLayersHarness(activeDocument,"WT");

                // =======================================================
                    // relink to new PSD
                    $.write("5..relinking file for Black Hands - Mixed type");
                    reLinkToFile("Middle",relativePath+"/Layout/Whitetail/" + countryCode1 , "/WTImage.psd","WT");
                                    // record which open document for the re-link layer
                    var WTopenDocument = app.activeDocument.name;
                    //Make the LSO-Hands folder (if not already there for the country)

                    createFolder(relativePath+"/Layout/Whitetail/" + countryCode1 + "/LSO-Hands");
                // =======================================================
                saveAs(WTopenDocument, relativePath +"/Layout/Whitetail/" + countryCode1 + "/LSO-Hands/");

                // Close the document
                closeDocument();
                // Re-link the Black hands to new new Black hands in the LSO-File
                 reLinkToFile("Black-Hands",relativePath+"/Layout/Whitetail/" + countryCode1 +"/LSO-Hands/" , WTopenDocument,"1L")

            }

             layerNameFound = findMatchInlayerNamesGlobalArray("White-Hands","1L");
             if(layerNameFound) {
                  //process white

                selectLayer("White-Hands","1L");
                 // edit contents of the SmartObject - White Hands
                editSmartObjectContents();
                // load layers for WhiteTail
                loadLayersHarness(activeDocument,"WT");

                // =======================================================
                reLinkToFile("Middle",relativePath+"/Layout/Whitetail/" + countryCode1 , "/WTImage.psd","WT");
                // record which open document for the re-link layer
                 var WTopenDocument = app.activeDocument.name;
                 //Make the LSO-Hands folder (if not already there for the country)
                 createFolder(relativePath+"/Layout/Whitetail/" + countryCode1 + "/LSO-Hands");

                // Save the doucment
                saveAs(WTopenDocument, relativePath +"/Layout/Whitetail/" + countryCode1 + "/LSO-Hands/");
                closeDocument();
                // Re-link the Black hands to new new Black hands in the LSO-File
                 reLinkToFile("White-Hands",relativePath+"/Layout/Whitetail/" + countryCode1 +"/LSO-Hands/" , WTopenDocument,"1L")
               }
             }





            return  okToContinue;
}


///////////////////////////////////////////////////////////////////////////////
// processSTATIC- Process static PSD files from the CSV file - Referenced by STATIC
// RC0006 - Added CSVArray7
///////////////////////////////////////////////////////////////////////////////

function processSTATIC(relativePath, coreLocation, countryCode1,csvArray1,csvArray2,csvArray3,csvArray4,csvArray5,csvArray6,csvArray7 ) {
                            /// open the static source document for each  Static Entry (only one static entry) - Taken from the Listener action (not hand coded)
                        // =======================================================
           //             var okToContinue = openPSDFile(relativePath, "/Layout/Static/Apple-3294-Deliverables.psd");
           // RC  - 24/04/2017
//           var okToContinue = openPSDFile(relativePath, "/Layout/Static/Apple-3294-Deliverables_Retina.psd");
///RC006
//            var okToContinue = openPSDFile(relativePath, "/Layout/Static/"+currentStaticPSD);
// open the base statis file as specified in the CSV file for each Static location
           var okToContinue = openPSDFile(relativePath, "/Layout/Static/"+csvArray1);
    ////////
                        if (okToContinue) {

                    // Static Positional names
                    $.writeln("csv0"+coreLocation);
                    $.writeln("csv1"+countryCode1);
//RC006                    $.writeln("csv3"+csvArray3);
                    $.writeln("csv4"+csvArray4);
                    // 300 x 250
                    //    writeTexttoLayer("Terms300x250",csvArray[6]);
                    //    writeTexttoLayer("Copy300x250",createNewLines(csvArray[4]));
                    //    writeTexttoLayer("CTACopy300x250",csvArray[5]);
//RC 006 //////
//                    writeTexttoLayer("Terms300x250",csvArray6);
//                    writeTexttoLayer("Copy300x250",createNewLines(csvArray4));
//                    writeTexttoLayer("CTACopy300x250",csvArray5);
                    writeTexttoLayer("Terms300x250",csvArray7);
                    writeTexttoLayer("Copy300x250",createNewLines(csvArray5));
                    writeTexttoLayer("CTACopy300x250",csvArray6);
/////////////////////

                       // 300 x 250 Retina
                    //writeTexttoLayer("Terms300x250Retina",csvArray6);
                    //writeTexttoLayer("Copy300x250Retina",createNewLines(csvArray4));
                    //writeTexttoLayer("CTACopy300x250Retina",csvArray5);


                    //480x320
                    //         writeTexttoLayer("Terms480x320",csvArray[6]);
                    //         writeTexttoLayer("Copy480x320",createNewLines(csvArray[4]));
                    //         writeTexttoLayer("CTACopy480x320",csvArray[5]);
//RC 006 //////

//                     writeTexttoLayer("Terms480x320",csvArray6);
//                    writeTexttoLayer("Copy480x320",createNewLines(csvArray4));
//                    writeTexttoLayer("CTACopy480x320",csvArray5);
                    writeTexttoLayer("Terms480x320",csvArray7);
                    writeTexttoLayer("Copy480x320",createNewLines(csvArray5));
                    writeTexttoLayer("CTACopy480x320",csvArray6);

/////////////////////
                    // 480x320 Retina
                    // writeTexttoLayer("Terms480x320Retina",csvArray6);
                    //writeTexttoLayer("Copy480x320Retina",createNewLines(csvArray4));
                    //writeTexttoLayer("CTACopy480x320Retina",csvArray5);

                    //320x480
                    //                    writeTexttoLayer("Terms320x480",csvArray[6]);
                    //                    writeTexttoLayer("Copy320x480",createNewLines(csvArray[4]));
                    //                    writeTexttoLayer("CTACopy320x480",csvArray[5]);
                    writeTexttoLayer("Terms320x480",csvArray7);
                    writeTexttoLayer("Copy320x480",createNewLines(csvArray5));
                    writeTexttoLayer("CTACopy320x480",csvArray6);
                    // 320x480-Retina
                    //writeTexttoLayer("Terms320x480Retina",csvArray6);
                    //writeTexttoLayer("Copy320x480Retina",createNewLines(csvArray4));
                    //writeTexttoLayer("CTACopy320x480Retina",csvArray5);

                    //   600x500
                    //RC 006 //////

                    //                    writeTexttoLayer("Terms600x500",csvArray6);
                    //                    writeTexttoLayer("Copy600x500",createNewLines(csvArray4));
                    //                    writeTexttoLayer("CTACopy600x500",csvArray5);
                    writeTexttoLayer("Terms600x500",csvArray7);
                    writeTexttoLayer("Copy600x500",createNewLines(csvArray5));
                    writeTexttoLayer("CTACopy600x500",csvArray6);

                    //RC006 /////////////////////
                    //   600x500 Retina
                    //writeTexttoLayer("Terms600x500Retina",csvArray6);
                    //writeTexttoLayer("Copy600x500Retina",createNewLines(csvArray4));
                    //writeTexttoLayer("CTACopy600x500Retina",csvArray5);

                    //960x640
                    //RC 006 //////

                    //                    writeTexttoLayer("Terms960x640",csvArray6);
                    //                    writeTexttoLayer("Copy960x640",createNewLines(csvArray4));
                    //                    writeTexttoLayer("CTACopy960x640",csvArray5);
                    writeTexttoLayer("Terms960x640",csvArray7);
                    writeTexttoLayer("Copy960x640",createNewLines(csvArray5));
                    writeTexttoLayer("CTACopy960x640",csvArray6);
                    //RC006 /////////////////////
                    //960x640 Retina
                    //writeTexttoLayer("Terms960x640Retina",csvArray6);
                    //writeTexttoLayer("Copy960x640Retina",createNewLines(csvArray4));
                    //writeTexttoLayer("CTACopy960x640Retina",csvArray5);

                    //640x960
                    //RC 006 //////
                    //                    writeTexttoLayer("Terms640x960",csvArray6);
                    //                    writeTexttoLayer("Copy640x960",createNewLines(csvArray4));
                    //                    writeTexttoLayer("CTACopy640x960",csvArray5);
                    writeTexttoLayer("Terms640x960",csvArray7);
                    writeTexttoLayer("Copy640x960",createNewLines(csvArray5));
                    writeTexttoLayer("CTACopy640x960",csvArray6);
                    //RC006 /////////////////////
                    //640x960 Retina
                    //writeTexttoLayer("Terms640x960Retina",csvArray6);
                    //writeTexttoLayer("Copy640x960Retina",createNewLines(csvArray4));
                    //writeTexttoLayer("CTACopy640x960Retina",csvArray5);

                    // Re link core file assets
                    //                    reLinkToFile("Static300Right",coreLocation+countryCode[1]+"/",csvArray[3]  );
                    //                   reLinkToFile("Static480Left",coreLocation+countryCode[1]+"/",csvArray[1]  );
                    //                   reLinkToFile("Static480Middle",coreLocation+countryCode[1]+"/",csvArray[2]  );
//                    reLinkToFile("Static300Right",coreLocation+countryCode1+"/",csvArray3  );
//                    reLinkToFile("Static480Left",coreLocation+countryCode1+"/",csvArray1  );
//                    reLinkToFile("Static480Middle",coreLocation+countryCode1+"/",csvArray2  );
                    //RC 006 //////
                 //   reLinkToFile("Static480x320Right",coreLocation+countryCode1+"/",csvArray3,"1L"  );
                 //   reLinkToFile("Static480x320Left",coreLocation+countryCode1+"/",csvArray1,"1L"  );
                 //   reLinkToFile("Static480x320Middle",coreLocation+countryCode1+"/",csvArray2,"1L"  );
                     reLinkToFile("Static480x320Right",coreLocation+countryCode1+"/",csvArray4,"1L"  );
                    reLinkToFile("Static480x320Left",coreLocation+countryCode1+"/",csvArray2,"1L"  );
                    reLinkToFile("Static480x320Middle",coreLocation+countryCode1+"/",csvArray3,"1L"  );
               //RC006 /////////////////////






                    }
                return  okToContinue;
}
///////////////////////////////////////////////////////////////////////////////
// saveFile- Save the current file as a derivative (handy if the operator needs to create a modification to an individual country / static file output
///////////////////////////////////////////////////////////////////////////////

function saveFile(outputLocation,countryCode1) {
                    // =======================================================
                    // Save current file to the country code folder described in the CSV file.- Code taken from the Listner action in PS (Just modified to be dynamic on the file names)
                    var idsave = charIDToTypeID( "save" );
                    var desc59 = new ActionDescriptor();
                    var idAs = charIDToTypeID( "As  " );
                    var desc60 = new ActionDescriptor();
                    var idmaximizeCompatibility = stringIDToTypeID( "maximizeCompatibility" );
                    desc60.putBoolean( idmaximizeCompatibility, true );
                    var idPhtthree = charIDToTypeID( "Pht3" );
                    desc59.putObject( idAs, idPhtthree, desc60 );
                    var idIn = charIDToTypeID( "In  " );
                    //                    desc59.putPath( idIn, new File( outputLocation+countryCode[1]+"_test1harness.psd" ) );
                    desc59.putPath( idIn, new File( outputLocation+countryCode1+".psd" ) );
                    var idDocI = charIDToTypeID( "DocI" );
                    desc59.putInteger( idDocI, 249 );
                    var idLwCs = charIDToTypeID( "LwCs" );
                    desc59.putBoolean( idLwCs, true );
                    var idsaveStage = stringIDToTypeID( "saveStage" );
                    var idsaveStageType = stringIDToTypeID( "saveStageType" );
                    var idsaveSucceeded = stringIDToTypeID( "saveSucceeded" );
                    desc59.putEnumerated( idsaveStage, idsaveStageType, idsaveSucceeded );
                    executeAction( idsave, desc59, DialogModes.NO );
    }

///////////////////////////////////////////////////////////////////////////////
// exportArtboards- Call the Photoshop Export Art board function - relies on a manual operation to input the country code and click OK, and OK to continue
///////////////////////////////////////////////////////////////////////////////

function exportArtboards() {
                     // Export Artboards to File - Call standard Photoshop Script - Code taken from the Listener
                    // The only thing missing is the code for the 2X retina versions., need to re-consult with Rosie to which ones are needed.
                    // =======================================================
                    var idAdobeScriptAutomationScripts = stringIDToTypeID( "AdobeScriptAutomation Scripts" );
                    var desc17 = new ActionDescriptor();
                    var idjsNm = charIDToTypeID( "jsNm" );
                    desc17.putString( idjsNm, """Artboards to Files...""" );
                    var idjsMs = charIDToTypeID( "jsMs" );
                    desc17.putString( idjsMs, """undefined""" );
                    executeAction( idAdobeScriptAutomationScripts, desc17, DialogModes.NO );
                    // =======================================================

    }

///////////////////////////////////////////////////////////////////////////////
// close Document- Close the current document
///////////////////////////////////////////////////////////////////////////////

function closeDocument() {
    // Close document - Code taken from the Photoshop Listener


    var idCls = charIDToTypeID( "Cls " );
    var desc143 = new ActionDescriptor();
    var idSvng = charIDToTypeID( "Svng" );
    var idYsN = charIDToTypeID( "YsN " );
    var idN = charIDToTypeID( "N   " );
    desc143.putEnumerated( idSvng, idYsN, idN );
    var idDocI = charIDToTypeID( "DocI" );
    desc143.putInteger( idDocI, 295 );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc143.putBoolean( idforceNotify, true );
    executeAction( idCls, desc143, DialogModes.NO );

    }

 function processROLLING(relativePath, coreLocation, countryCode1, csvArray1, csvArray2, csvArray3, csvArray4, csvArray5, csvArray6,csvArray7) {
               var okToContinue=true;

                // =======================================================
                // Each movie format has a different file type, so open each one.
                // i.e. 320x480.PSD

                okToContinue = openPSDFile(coreLocation, csvArray1+".psd");


                    // Static Positional names
                    // 300 x 250
                    //     writeTexttoLayer("Terms300x250",csvArray[6]);
                    //     writeTexttoLayer("Copy300x250",createNewLines(csvArray[4]));
                    //    writeTexttoLayer("CTACopy300x250",csvArray[5]);

                    //480x320
                    //    writeTexttoLayer("Terms480x320",csvArray[6]);
                    //    writeTexttoLayer("Copy480x320",createNewLines(csvArray[4]));
                    //    writeTexttoLayer("CTACopy480x320",csvArray[5]);
                    //320x480
                    //    writeTexttoLayer("Terms320x480",csvArray[6]);
                    //    writeTexttoLayer("Copy320x480",createNewLines(csvArray[4]));
                    //    writeTexttoLayer("CTACopy320x480",csvArray[5]);

    if (okToContinue) {
                    // Re link core file assets

                      $.writeln("Looking for name - AnimPlaceHolder_Right");
                      if (csvArray4 != "") {
                         reLinkToFile("AnimPlaceHolder_Right",rollingcoreLocation+countryCode1+"/AnimPositions/",csvArray4,"1L"  );
                       }

                        // If left and middle extist, then need to update these as well (RC)
                        if (csvArray2 != "") {
                           $.write("looking for left value " +csvArray2);
                          reLinkToFile("Left",rollingcoreLocation+countryCode1+"/AnimStatics/",csvArray2,"1L"  );
                            }
                        if (csvArray3 != "") {
                               $.write("looking for Middle value " +csvArray3);
                        reLinkToFile("Middle",rollingcoreLocation+countryCode1+"/AnimStatics/", csvArray3,"1L" );

                            }

                        // ONly update text if there is text defined in the CSV file

                        if (csvArray5 != "" ) {
                            writeTexttoLayer("CopyAnimPlaceHolder",createNewLines(csvArray5));
                        }
                        if (csvArray6 != "" ) {
                            writeTexttoLayer("TermsAnimPlaceHolder",csvArray7);
                        }
                        if (csvArray7 != "" ) {
                            writeTexttoLayer("CTACopyAnimPlaceHolder",csvArray6);
                        }
                    }
                return okToContinue;
  }

///////////////////////////////////////////////////////////////////////////////
// openPSDFile- Open a PSD document and make it active
///////////////////////////////////////////////////////////////////////////////


  function openPSDFile(relativePath, fileToOpen) {
                        var okToContinue=true;
                             // =======================================================
                        var idOpn = charIDToTypeID( "Opn " );
                        var desc231 = new ActionDescriptor();
                        var idnull = charIDToTypeID( "null" );

                        // This is the file that contins the base layout for the 3Device. Other PSD files (defined in the CSV file (Left , Middle and Right) are refered to by using Linked Smart Objects. These files
                        // are to be maintained by the designer.

                // does file exist ? if not, then write error
                    if (File(relativePath+fileToOpen).exists) {
//                        $.writeln("File " + relativePath+fileToOpen +" opening");
                        // code from the Photoshop Listner
                        desc231.putPath( idnull, new File( relativePath+fileToOpen) );
                        var idAs = charIDToTypeID( "As  " );
                        var desc232 = new ActionDescriptor();
                        var idmaximizeCompatibility = stringIDToTypeID( "maximizeCompatibility" );
                        desc232.putBoolean( idmaximizeCompatibility, true );
                        var idPhtthree = charIDToTypeID( "Pht3" );
                        desc231.putObject( idAs, idPhtthree, desc232 );
                        var idDocI = charIDToTypeID( "DocI" );
                        desc231.putInteger( idDocI, 613 );
                        executeAction( idOpn, desc231, DialogModes.NO );
                        // Read layers into Global Array

                        loadLayersHarness(activeDocument,"1L");
                        $.writeln("number of layers loaded=" + layerNamesGlobalArray.length);
                        } else {
                            $.writeln("File " + relativePath+fileToOpen +" does not exist, IGNORED");
                            okToContinue = false;
                         }

            return okToContinue;
      }

///////////////////////////////////////////////////////////////////////////////
// findLayerHarness- Find a layer name in the global array. This makes sure that a text layer exists before we try to update it.
///////////////////////////////////////////////////////////////////////////////


  function findLayerHarness(ref, name,numberOfLayersFound) {
        var okToContinue= false;
        numberOfLayersFound = findLayer(activeDocument, layerName,0);

        $.writeln("number of layers found = " +numberOfLayersFound);
        // If a layer (s) have ben found then it's ok to process this change

        if (numberOfLayersFound>0) {
          okToContinue=true;
          }  else {okToContinue=false;
        }

 }

///////////////////////////////////////////////////////////////////////////////
// findLayer - iterate through layers to find a match
///////////////////////////////////////////////////////////////////////////////

function findLayer(ref, name,numberOfLayersFound) {
    // assume that layer does not exist in PSD
    var okToContinue=false;

    okToContinue = hasLayers();


        // declare local variables
        var layers = ref.layers;
        var len = layers.length;
        var match = false;
        // see if layer names exists
        if (okToContinue) {
            // iterate through layers to find a match
            for (var i = 0; i < len; i++) {
            // test for matching layer
                var layer = layers[i];
           //     $.writeln("-->layer name = "+layer.name);
                if (layer.name.toLowerCase() == name.toLowerCase()) {
                    numberOfLayersFound++;
                //     $.writeln("-->found layer name = "+name);
                    // when layer name has been found,  terminate find logic
                //    $.writeln("3....");
                    return numberOfLayersFound;
                    break;
                }
                // handle groups (layer sets)
                else if (layer.typename == 'LayerSet') {
                 numberOfLayersFound = findLayer(layer, name,numberOfLayersFound);
                }
           }
         }
     return    numberOfLayersFound;

 }

///////////////////////////////////////////////////////////////////////////////
// loadLayersHarness - The layers loader is recursive, so need to have a front harnes to manage it. Load layer names into a global array
///////////////////////////////////////////////////////////////////////////////

function loadLayersHarness(ref,whichArray) {
    // Clear Array
    if (whichArray=="1L") {
        layerNamesGlobalArray = Array();
        loadLayers(ref,whichArray);
    }
    // Process Whitetail later names array
    if (whichArray=="WT") {

        layerNamesWTGlobalArray = Array();
        loadLayers(ref,whichArray);
    }

}
///////////////////////////////////////////////////////////////////////////////
// loadLayers - This function will look through the open PSD file and layer names into the global array.
///////////////////////////////////////////////////////////////////////////////


function loadLayers(ref,whichArray) {
    // assume that layer does not exist in PSD
    var okToContinue=false;

    okToContinue = hasLayers();


        // declare local variables
        var layers = ref.layers;
        var len = layers.length;
        // see if layer names exists
        if (okToContinue) {
            // iterate through layers to find a match
            for (var i = 0; i < len; i++) {
            // test for matching layer
                var layer = layers[i];
                $.writeln("layer name "+layer.name + "  - layer type " +layer.typename);
                if (layer.typename == 'ArtLayer') {
                        if (whichArray=="1L") {
                            layerNamesGlobalArray.push(layer.name);
                        }
                    if (whichArray=="WT") {
                        layerNamesWTGlobalArray.push(layer.name);
                    }
                }
                if (layer.typename == 'LayerSet') {
                     // handle groups (layer sets)
                 loadLayers(layer,whichArray);
                }
           }

       }
 }
 ///////////////////////////////////////////////////////////////////////////////
// function to read array and find a match
 ///////////////////////////////////////////////////////////////////////////////
function findMatchInlayerNamesGlobalArray(nameToFind,whichArray) {
    var okToContinue=false;
    //Process main PSD's layer names
    $.write("processing array "+whichArray+", for layer "+nameToFind);

    if (whichArray=="1L") {
    for (x=0;x<layerNamesGlobalArray.length;x++) {
        if (layerNamesGlobalArray[x].toLowerCase() == nameToFind.toLowerCase()) {
                okToContinue = true;
            }
        }
    }
    // Process WT layer names (will be second level)
    if (whichArray=="WT") {
        for (x=0;x<layerNamesWTGlobalArray.length;x++) {
        if (layerNamesWTGlobalArray[x].toLowerCase() == nameToFind.toLowerCase()) {
            $.writeln("a="+layerNamesWTGlobalArray[x].toLowerCase() + "match " +nameToFind.toLowerCase());

                okToContinue = true;
            }
        }
    }

    return okToContinue;

    }
  ///////////////////////////////////////////////////////////////////////////////
// hasLayers - ensure that the active document contains at least one layer
///////////////////////////////////////////////////////////////////////////////
function hasLayers() {
    var okToContinue=true;
	var doc = activeDocument;

	if (doc.layers.length == 1 && doc.activeLayer.isBackgroundLayer) {
		$.writeln('The active document has no layers.', 'No Layers', false);
		okToContinue= false;
	}
    return okToContinue;
}

///////////////////////////////////////////////////////////////////////////////
// editSmartObjectContents- Placed Layer Edit Contents
///////////////////////////////////////////////////////////////////////////////
function editSmartObjectContents() {
   var idplacedLayerEditContents = stringIDToTypeID( "placedLayerEditContents" );
    var desc13 = new ActionDescriptor();
     executeAction( idplacedLayerEditContents, desc13, DialogModes.NO );
}

///////////////////////////////////////////////////////////////////////////////
// Save As- SAve File as for the WT
///////////////////////////////////////////////////////////////////////////////
function saveAs(fileNametoSave, saveLocation) {
    var idsave = charIDToTypeID( "save" );
    var desc252 = new ActionDescriptor();
    var idAs = charIDToTypeID( "As  " );
    var desc253 = new ActionDescriptor();
    var idmaximizeCompatibility = stringIDToTypeID( "maximizeCompatibility" );
    desc253.putBoolean( idmaximizeCompatibility, true );
    var idPhtthree = charIDToTypeID( "Pht3" );
    desc252.putObject( idAs, idPhtthree, desc253 );
    var idIn = charIDToTypeID( "In  " );
//    desc252.putPath( idIn, new File( "/Users/rcurtis/Creative Cloud Files/Fetch_Automation_Testing/Fetch Proposed - Automated/Layout/WhiteTail/India/LSO-Hands/Black-Hand-Right.psd" ) );
    desc252.putPath( idIn, new File( saveLocation,fileNametoSave ) );
    var idDocI = charIDToTypeID( "DocI" );
    desc252.putInteger( idDocI, 1212 );
    var idLwCs = charIDToTypeID( "LwCs" );
    desc252.putBoolean( idLwCs, true );
    var idsaveStage = stringIDToTypeID( "saveStage" );
    var idsaveStageType = stringIDToTypeID( "saveStageType" );
    var idsaveSucceeded = stringIDToTypeID( "saveSucceeded" );
    desc252.putEnumerated( idsaveStage, idsaveStageType, idsaveSucceeded );
executeAction( idsave, desc252, DialogModes.NO );
}


///////////////////////////////////////////////////////////////////////////////
// RC006 - Read image files from the Artboard process and allow the user to resize them
// need to know when this is executed.
///////////////////////////////////////////////////////////////////////////////

function processBigImageFiles(folderName,maxSizeKB) {

        var aChildren = Folder(folderName).getFiles();

        var aProcessedOBJ=0;

            $.write("processing " + aChildren.length + ", max size KB " +maxSizeKB);

            for (var i = 0; i < aChildren.length; i++) {
                  var child = aChildren[i];
                if (onlyReadImages(child.name) ) {

                    if (child.length > maxSizeKB) {
                        $.writeln ( "child name,"+child.name+" , "+ child.name + " , " +child.length);
                        var actionComplete = openImageFile(folderName, child.name);
                    }

                    if (child instanceof Folder) {
                        $.write(folderName+"/"+child.name + " , " +child.length+".");
                    }
                }
            }
 }
///////////////////////////////////////////////////////////////////////////////
// Save As- SAve File as for the WT
// RC006 - Added function to read only images (JPG, PNG etc)
///////////////////////////////////////////////////////////////////////////////
 function onlyReadImages(filename) {
      var image=false;
      var splitvalueJPG = filename.indexOf("jpg") ;
      var splitvaluePNG = filename.indexOf("png") ;
         // $.writeln ( "thisLine"+thisLine);
         if (splitvalueJPG>0 || splitvaluePNG>0) {
             $.write("processing image");
             image=true;
         }
     return image;
     }

 ///////////////////////////////////////////////////////////////////////////////
// Save As- SAve File as for the WT
// RC006 - Added function to open images into Photoshop (The active App)
///////////////////////////////////////////////////////////////////////////////

   function openImageFile(relativePath, fileToOpen) {
                        var okToContinue=true;
                             // =======================================================
                        var idOpn = charIDToTypeID( "Opn " );
                        var desc231 = new ActionDescriptor();
                        var idnull = charIDToTypeID( "null" );

                        // This is the file that contins the base layout for the 3Device. Other PSD files (defined in the CSV file (Left , Middle and Right) are refered to by using Linked Smart Objects. These files
                        // are to be maintained by the designer.

                // does file exist ? if not, then write error
                 $.writeln("here = "+ relativePath+"/"+fileToOpen + " , " + File(relativePath+fileToOpen).exists);
                    if (File(relativePath+"/"+fileToOpen).exists) {
                       $.writeln("File " + relativePath+"/"+fileToOpen +" opening");
                        // code from the Photoshop Listner

                        var idOpn = charIDToTypeID( "Opn " );
                        var desc310 = new ActionDescriptor();
                        var idnull = charIDToTypeID( "null" );
                        desc310.putPath( idnull, new File( relativePath+"/"+fileToOpen ) );
                        var idDocI = charIDToTypeID( "DocI" );
                        desc310.putInteger( idDocI, 473 );
                        executeAction( idOpn, desc310, DialogModes.NO );

                        // Execute Save for Web Legacy for control the file size
                        saveForWebLegacyOptionAll();
                        // CLose file once saved
                        closeDocDontSave() ;


      }
          return okToContinue;
  }


 ///////////////////////////////////////////////////////////////////////////////
// Save for Web Legay - All options
// RC006 - Added function to save for Web.
///////////////////////////////////////////////////////////////////////////////
function saveForWebLegacyOptionAll() {
var idExpr = charIDToTypeID( "Expr" );
    var desc331 = new ActionDescriptor();
    var idUsng = charIDToTypeID( "Usng" );
        var desc332 = new ActionDescriptor();
        var idOp = charIDToTypeID( "Op  " );
        var idSWOp = charIDToTypeID( "SWOp" );
        var idOpRe = charIDToTypeID( "OpRe" );
        desc332.putEnumerated( idOp, idSWOp, idOpRe );
        var idFmt = charIDToTypeID( "Fmt " );
        var idIRFm = charIDToTypeID( "IRFm" );
        var idPNGeight = charIDToTypeID( "PNG8" );
        desc332.putEnumerated( idFmt, idIRFm, idPNGeight );
        var idIntr = charIDToTypeID( "Intr" );
        desc332.putBoolean( idIntr, false );
        var idRedA = charIDToTypeID( "RedA" );
        var idIRRd = charIDToTypeID( "IRRd" );
        var idPrcp = charIDToTypeID( "Prcp" );
        desc332.putEnumerated( idRedA, idIRRd, idPrcp );
        var idRChT = charIDToTypeID( "RChT" );
        desc332.putBoolean( idRChT, false );
        var idRChV = charIDToTypeID( "RChV" );
        desc332.putBoolean( idRChV, false );
        var idAuRd = charIDToTypeID( "AuRd" );
        desc332.putBoolean( idAuRd, false );
        var idNCol = charIDToTypeID( "NCol" );
        desc332.putInteger( idNCol, 64 );
        var idDChS = charIDToTypeID( "DChS" );
        desc332.putInteger( idDChS, 0 );
        var idDCUI = charIDToTypeID( "DCUI" );
        desc332.putInteger( idDCUI, 0 );
        var idDChT = charIDToTypeID( "DChT" );
        desc332.putBoolean( idDChT, false );
        var idDChV = charIDToTypeID( "DChV" );
        desc332.putBoolean( idDChV, false );
        var idWebS = charIDToTypeID( "WebS" );
        desc332.putInteger( idWebS, 0 );
        var idTDth = charIDToTypeID( "TDth" );
        var idIRDt = charIDToTypeID( "IRDt" );
        var idNone = charIDToTypeID( "None" );
        desc332.putEnumerated( idTDth, idIRDt, idNone );
        var idTDtA = charIDToTypeID( "TDtA" );
        desc332.putInteger( idTDtA, 100 );
        var idTrns = charIDToTypeID( "Trns" );
        desc332.putBoolean( idTrns, true );
        var idMtt = charIDToTypeID( "Mtt " );
        desc332.putBoolean( idMtt, true );
        var idDthr = charIDToTypeID( "Dthr" );
        var idIRDt = charIDToTypeID( "IRDt" );
        var idDfsn = charIDToTypeID( "Dfsn" );
        desc332.putEnumerated( idDthr, idIRDt, idDfsn );
        var idDthA = charIDToTypeID( "DthA" );
        desc332.putInteger( idDthA, 100 );
        var idEICC = charIDToTypeID( "EICC" );
        desc332.putBoolean( idEICC, true );
        var idMttR = charIDToTypeID( "MttR" );
        desc332.putInteger( idMttR, 255 );
        var idMttG = charIDToTypeID( "MttG" );
        desc332.putInteger( idMttG, 255 );
        var idMttB = charIDToTypeID( "MttB" );
        desc332.putInteger( idMttB, 255 );
    var idSaveForWeb = stringIDToTypeID( "SaveForWeb" );
    desc331.putObject( idUsng, idSaveForWeb, desc332 );
executeAction( idExpr, desc331, DialogModes.ALL );
}


function closeDocDontSave() {
    // =======================================================
var idCls = charIDToTypeID( "Cls " );
    var desc335 = new ActionDescriptor();
    var idSvng = charIDToTypeID( "Svng" );
    var idYsN = charIDToTypeID( "YsN " );
    var idN = charIDToTypeID( "N   " );
    desc335.putEnumerated( idSvng, idYsN, idN );
    var idDocI = charIDToTypeID( "DocI" );
    desc335.putInteger( idDocI, 8322 );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc335.putBoolean( idforceNotify, true );
executeAction( idCls, desc335, DialogModes.NO );
    }
