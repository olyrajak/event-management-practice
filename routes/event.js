var express = require("express");
var router = express.Router();
var moment = require("moment");
const Event = require("../models/event");
const Remark = require("../models/remark");

router.get("/", function(req, res, next) {
    Event.find({}, function(err, events) {
        if (err) return next(err);

        res.render("events", { events: events });
    });
});
router.get("/new", function(req, res, next) {
    res.render("createEvent");
});

router.get("/:id", function(req, res, next) {
    let id = req.params.id;
    Event.findById(id)
        .populate("remarks")
        .exec(function(err, event) {
            if (err) return next(err);
            res.render("singleEvent", {
                event,
                start_date: moment(event.start_date).format("DD-MM-YYYY"),
                end_date: moment(event.start_date).format("DD-MM-YYYY"),
            });
        });
});

router.get("/:id/edit", (req, res, next) => {
    var id = req.params.id;
    Event.findById(id, (err, event) => {
        if (err) return next(err);
        res.render("editEvent", {
            event: event,
            start_date: moment(event.start_date).format("YYYY-MM-DD"),
            end_date: moment(event.start_date).format("YYYY-MM-DD"),
        });
    });
});

router.post("/:id", (req, res, next) => {
    var id = req.params.id;
    Event.findByIdAndUpdate(id, req.body, (err, updatedevent) => {
        if (err) return next(err);
        res.redirect("/events/" + id);
    });
});

router.post("/:id/remarks", function(req, res, next) {
    let id = req.params.id;
    req.body.eventId = id;
    console.log(req.body);
    Remark.create(req.body, function(err, remark) {
        if (err) return next(err);
        Event.findByIdAndUpdate(
            id, { $push: { remarks: remark._id } },
            function(err, event) {
                if (err) return next(err);
                res.redirect('/events/${id}');
            }
        );
    });
});

router.get("/:id/like", function(req, res, next) {
    let id = req.params.id;
    Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, function(err, event) {
        if (err) return next(err);
        res.redirect('/events/${id}');
    });
});

router.get("/:id/dislike", function(req, res, next) {
    let id = req.params.id;
    Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, function(err, event) {
        if (err) return next(err);
        res.redirect('/events/${id}');
    });
});

router.post("/", function(req, res, next) {
    Event.create(req.body, (err, createdevent) => {
        if (err) return next(err);
        res.redirect("/events");
    });

    // res.send(req.body);
});

router.get("/:id/delete", (req, res, next) => {
    var id = req.params.id;
    Event.findByIdAndDelete(id, (err, event) => {
        if (err) return next(err);
        Remark.deleteMany({ eventId: event.id }, (err, info) => {
            if (err) return next(err);
            Remark.remove({ eventId: event.id }, (err) => {
                if (err) return next(err);
                res.redirect("/events");
            });
        });
    });
});
module.exports = router;