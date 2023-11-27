import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { StudentService } from '../modules/student/student.service';
import createServer from '../server';

const app = createServer();

const studentData = {
   name: 'bappada',
   email: 'bappada@mail.com',
   age: 35,
};

describe('Student', () => {
   beforeAll(async () => {
      const mongoDbMemoryServer = await MongoMemoryServer.create();
      const uri = mongoDbMemoryServer.getUri();
      await mongoose.connect(uri);
   });

   afterAll(async () => {
      await mongoose.disconnect();
   });

   describe('GET  student route', () => {
   

      it('should return the student for correct email', async () => {

         const student = await StudentService.createStudent(studentData);
         const { statusCode, body } = await supertest(app).get(
            `/api/v1/student/${student?.email}`
         );

         expect(statusCode).toBe(200);
         expect(body.data.email).toBe(student?.email);
      });

      it.only('should return 404 for an unknown email', async () => {
         const email = 'unknown@mail.com';
         await supertest(app).get(`/api/v1/student/${email}`).expect(404);
      });
   });

   // describe.skip('POST  student route', () => {
   //    it('should return 500 for invalid student data', async () => {
   //       const studentData = {
   //          name: 'Mezba',
   //          age: 35,
   //       };

   //       const { statusCode, body } = await supertest(app)
   //          .post(`/api/v1/student`)
   //          .send(studentData);

   //       expect(statusCode).toBe(500);
   //       expect(body.success).toBeFalsy();
   //    });
   // });
});

