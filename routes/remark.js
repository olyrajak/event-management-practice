var express = require("express");
var router = express.Router();

const Event = require("../models/event");
const Remark = require("../models/remark");

/* GET home page. */
router.get("/:id/like", function (req, res, next) {
  let id = req.params.id;
  Remark.findByIdAndUpdate(id, { $inc: { likes: 1 } }, function (err, remark) {
    if (err) return next(err);
    res.redirect(`/events/${remark.eventId}`);
  });
});

router.get("/:id/dislike", function (req, res, next) {
  let id = req.params.id;
  Remark.findByIdAndUpdate(id, { $inc: { likes: -1 } }, function (err, remark) {
    if (err) return next(err);
    res.redirect(`/events/${remark.eventId}`);
  });
});

router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndRemove(id, (err, remark) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      remark.eventId,
      { $pull: { remarks: remark._id } },
      (err, event) => {
        if (err) return next(err);
        res.redirect("/events/" + remark.eventId);
      }
    );
  });
});

router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Remark.findById(id, (err, remark) => {
    if (err) return next(err);
    res.render("updateRemark", { remark });
  });
});

router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndUpdate(id, req.body, (err, updatedremark) => {
    if (err) return next(err);
    res.redirect("/events/" + updatedremark.eventId);
  });
});

module.exports = router;
