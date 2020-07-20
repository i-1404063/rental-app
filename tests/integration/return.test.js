const { Rentals } = require('../../models/rental');
const { Movies } = require('../../models/movie');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest'); //for server
const moment = require('moment'); //for setting current date time

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const execute = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../app');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movies({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10,
    });

    await movie.save();

    rental = new Rentals({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rentals.remove({});
    await Movies.remove({});
  });

  it('should return 401 if client is not logged in', async () => {
    token = '';
    const res = await execute();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    // delete payload.customerId;
    customerId = '';
    const res = await execute();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    // delete payload.movieId;
    movieId = '';
    const res = await execute();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental is found for the customer/movie', async () => {
    // delete payload.movieId;
    await Rentals.remove({});
    const res = await execute();

    expect(res.status).toBe(404);
  });

  it('should return 400 if rental is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await execute();
    expect(res.status).toBe(400);
  });

  it('should return 200 if the request is valid', async () => {
    const res = await execute();

    expect(res.status).toBe(200);
  });

  it('should set the returnDate if input is valid', async () => {
    const res = await execute();

    const rentalInDb = await Rentals.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set the rentalFee if input is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();
    const res = await execute();

    const rentalInDb = await Rentals.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it('should increase the movie stock if input is valid', async () => {
    const res = await execute();

    const movieInDb = await Movies.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental if input is valid', async () => {
    const res = await execute();

    const rentalInDb = await Rentals.findById(rental._id);
    // expect(res.body).toHaveProperty('dateOut');
    // expect(res.body).toHaveProperty('rentalFee');
    // expect(res.body).toHaveProperty('dateReturned');
    // expect(res.body).toHaveProperty('movie');
    // expect(res.body).toHaveProperty('customer');

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'customer',
        'movie',
      ])
    );
  });
});
