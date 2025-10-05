const express = require('express');
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing, destroyListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})




router.route("/")
.get(wrapAysnc(listingController.index))//Index Route
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAysnc(listingController.createListing));//Create Route
//NEW Route
router.get("/new",isLoggedIn,listingController.renderNewForm);


// Search route
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query; // get the search term
        // Search by title or location (case insensitive)
        const regex = new RegExp(q, 'i'); // 'i' => case insensitive
        const results = await Listing.find({
            $or: [
                { title: regex },
                { location: regex },
                { country: regex }
            ]
        });

        res.render('listings/index', { allListings: results, currUser: req.user });
    } catch (err) {
        console.error(err);
        res.send("Something went wrong while searching");
    }
});



router.route("/:id")
.get(wrapAysnc(listingController.showListing))//Show Route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAysnc(listingController.updateListing))//UPDATE ROUTE
.delete(isLoggedIn,isOwner,wrapAysnc(listingController.destroyListing));//DELETE ROUTE


router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });
  res.render('listings/category.ejs', { listings, category });
});

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAysnc(listingController.renderEditForm));


module.exports = router;
 