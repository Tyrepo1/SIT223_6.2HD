  import { app, server } from '../server.js'; 
  import { use, expect } from 'chai';
  import chaiHttp from 'chai-http';
  const chai = use(chaiHttp);

  describe('Express App', () => {
    it('should return "Hello World!" on GET /', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.equal('Hello World!!!');
          done();
        });
    });

    after((done) => {
      server.close(done);
    });
  });
