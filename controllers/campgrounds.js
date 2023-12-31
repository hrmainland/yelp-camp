const Campground = require("../models/campground")

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash("error", "Cant find that campground.")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground });
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Successfully added a new campground")
    res.redirect(`campgrounds/${campground.id}`)
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cant find that campground.")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', `Successfully updated ${campground.title}`)
    res.redirect(`/campgrounds/${id}`)
}


module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${campground.title}`)
    res.redirect("/campgrounds");
}

module.exports.renderNewCampground = (req, res) => {
    res.render("campgrounds/new")
}