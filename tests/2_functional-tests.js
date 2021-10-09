const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
issueId = null;
chai.use(chaiHttp);

suite('Functional Tests', function() {

 test("creating normal issue", (done) => {
        chai.
            request(server)
            .post("/api/issues/TestProject")
            .send({
                issue_title: "test title",
                issue_text: "some issue text",
                created_by: "by someone",
                assigned_to: "assigned to someone",
                status_text: "status"
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.isString(res.body.issue_title)
                assert.isString(res.body.issue_text)
                assert.isString(res.body.created_by)
                assert.isString(res.body.assigned_to)
                assert.isString(res.body.status_text)
                assert.isOk(res.body.created_on)
                assert.isOk(res.body.updated_on);
                issueId = res.body._id;

                done();
            })

    })

   test("creating normal issue with required fields", (done) => {
        chai.
            request(server)
            .post("/api/issues/TestProject")
            .send({
                issue_title: "test title",
                issue_text: "some issue text",
                created_by: "by someone"

            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.isString(res.body.issue_title)
                assert.isString(res.body.issue_text)
                assert.isString(res.body.created_by)
                assert.isEmpty(res.body.assigned_to)
                assert.isEmpty(res.body.status_text)
                assert.isOk(res.body.created_on)
                assert.isOk(res.body.updated_on);

                done();
            })

    })

   test("creating  issue with missing required fields", (done) => {
        chai.
            request(server)
            .post("/api/issues/TestProject")
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isDefined(res.body.error)
                assert.equal(res.body.error, "required field(s) missing")

                done();
            })

    })

    test("view issues on a project ", (done) => {
        chai.
            request(server)
            .get("/api/issues/TestProject")
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isArray(res.body)

                done();
            })

    })

    test("view issues on a project with single filter ", (done) => {
        chai.
            request(server)
            .get("/api/issues/TestProject?issue_title=test title")
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isArray(res.body)

                done();
            })

    })


    test("view issues on a project with multipe filters ", (done) => {
        chai.
            request(server)
            .get("/api/issues/TestProject?issue_title=test title&issue_text=some issue text")
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isArray(res.body)

                done();
            })

    })

    test("Update one field on an issue", (done) => {
        chai.
            request(server)
            .put("/api/issues/TestProject")
            .send({
                _id: issueId,
                issue_text: "updatedText"
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.equal(res.body.result, "successfully updated")

                done();
            })

    })

    test("Update multiple fields on an issue", (done) => {
        chai.
            request(server)
            .put("/api/issues/TestProject")
            .send({
                _id: issueId,
                issue_text: "updatedText",
                issue_title: "updatedTitle"

            })
            .end((err, res) => {

                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.equal(res.body.result, "successfully updated")


                done();
            })

    })

    test("Update an issue with missing _id", (done) => {
        chai.
            request(server)
            .put("/api/issues/TestProject")
            .send({

                issue_text: "updatedText",
                issue_title: "updatedTitle"

            })
            .end((err, res) => {

                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.isDefined(res.body.error)
                assert.equal(res.body.error, "missing _id")

                done();
            })

    })

    test("Update an issue with no fields to update", (done) => {
        chai.
            request(server)
            .put("/api/issues/TestProject")
            .send({
                _id: issueId
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.isDefined(res.body.error)
                assert.equal(res.body.error, "no update field(s) sent")

                done();
            })

    })


    test("Update an issue with an invalid _id", (done) => {
        chai.
            request(server)
            .put("/api/issues/TestProject")
            .send({
                _id: "dsfdsgdgd54gd",
                issue_text: "updatedText",
                issue_title: "updatedTitle"

            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.isDefined(res.body.error)
                assert.equal(res.body.error, "could not update")

                done();
            })

    })

    test("Delete an issue: DELETE request ", (done) => {
        chai.
            request(server)
            .delete("/api/issues/TestProject")
            .send({
                _id: issueId,
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.isDefined(res.body.result)
                assert.equal(res.body.result, "successfully deleted")

                done();
            })

    })

    test("Delete an issue with an invalid _id ", (done) => {
        chai.
            request(server)
            .delete("/api/issues/TestProject")
            .send({
                _id: "sfqsfqsf63232",
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.isDefined(res.body.error)
                assert.equal(res.body.error, "could not delete")

                done();
            })

    })

    test("Delete an issue with missing _id ", (done) => {
        chai.
            request(server)
            .delete("/api/issues/TestProject")
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.typeOf(res.body, 'object')
                assert.isDefined(res.body.error)
                assert.equal(res.body.error, "missing _id")

                done();
            })

    })


});
