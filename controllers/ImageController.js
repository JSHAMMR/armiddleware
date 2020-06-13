'use strict';

const cv = require('opencv4nodejs');

// Declare object detect and compute async for opencv
const detectAndComputeAsync = (det, img) =>
    det.detectAsync(img)
        .then(kps => det.computeAsync(img, kps)
            .then(desc => ({ kps, desc }))
        );
// Change based on prefer image
const img1 = cv.imread('data/per.jpg');
const img2 = cv.imread('data/husky.jpg');

const img3 = cv.imread('descriptors/desc.png');
const img4 = cv.imread('descriptors/desc1.png');

const detectorNames = [
    // 'AKAZE',
    // 'BRISK',
    // 'KAZE',
    'ORB'
];
const createDetectorFromName = name => new cv[`${name}Detector`]();

// Match the image
exports.match = function(req,res) {


    
   
    try{
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        var file = req.files.sampleImage;
        var filename = file.name;


         // Create folder first before move the file
        file.mv('uploadedImage/'+filename, function(){

            const query = cv.imread('data/husky.jpg',0); /// change it to image url from db
            const target = cv.imread('uploadedImage/'+filename,0);

            try {
                detectorNames.map(createDetectorFromName).map(det =>
                    Promise.all([detectAndComputeAsync(det, target), detectAndComputeAsync(det, query)])
                        .then(allResults =>
                            cv.matchBruteForceAsync(
                                target,
                                query
                            ).then(matches => ({
                                matches,
                                kps1: allResults[0].kps,
                                kps2: allResults[1].kps
                            }))
                                .then(function (value) {
                                    console.log(value.matches);

                                    const bestN = 40;
                                    const bestMatches = value.matches.sort(
                                        (match1, match2) => match1.distance - match2.distance
                                    ).slice(0, bestN);



                                    var count  = 0;



                                    bestMatches.forEach  (item => {


                                        if (item.distance < 64) {
                                            count  = count + 1;

                                        }


                                    }

                                );


                                if (count > 20) {
                                    return res.status(200).send('Matched');

                                } else {
                                    return res.status(200).send('Not Matched');

                                }



                                    console.log(bestMatches);

                                })
                        )
                )
            } catch (err) {
                console.log(err);
            }





        })
    }catch(err){
        res.status(500).send({ error: false, message: 'Unsuccessful' });
    }
}

// Rate the image
exports.rate= function(req,res){



    try{
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        var file = req.files.sampleImage;
        var filename = file.name;


        // open cv rating image



        // Noor add value to DB


         // Create folder first before move the file
        file.mv('uploadedImage/'+filename, function(){
            res.status(200).send({ error: false, message: 'Successful moved' });
            cv.imread('uploadedImage/'+filename);
            res.send('File Uploaded')
        })
    }catch(err){
        res.status(500).send({ error: false, message: 'Unsuccessful' });
    }
}

// save the descriptor
exports.saveDiscriptor= function(req,res){



    try{
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        var file = req.files.sampleImage;
        var filename = file.name;


        // get desc
       


        // Noor add value to DB


         // Create folder first before move the file
        file.mv('uploadedImage/'+filename, function(){

            const filenameD = cv.imread('uploadedImage/'+filename);

            const promises = detectorNames
            .map(createDetectorFromName)
            .map(det =>
              // also detect and compute descriptors for img1 and img2 async
              Promise.all([detectAndComputeAsync(det, filenameD)])
                .then(allResults =>


                //   cv.matchBruteForceAsync(
                //     allResults[0].desc
                    
                //   )

                cv.imwrite('descriptors/desc.png', allResults[0].desc)





                
                )
                
          );




            // res.status(200).send({ error: false, message: 'Successful moved' });
            // cv.imread('uploadedImage/'+filename);
            res.send('File Uploaded')
        })
    }catch(err){
        res.status(500).send({ error: false, message: err.message });
    }
}