import * as Yup from 'yup';
import { Op } from 'Sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { q } = req.query;
    if (q) {
      const students = await Student.findAll({
        where: {
          name: {
            [Op.like]: q,
          },
        },
      });
      return res.json(students);
    }
    const students = await Student.findAll();
    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation is falied ' });
    }
    const student = await Student.create(req.body);
    return res.json(student);
  }

  async show(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student is not found' });
    }
    const { id, name, email, age, weight, height } = student;
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation is failed' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student is not found' });
    }
    const { name, email, age, weight, height } = await student.update(req.body);
    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student is not found' });
    }
    student.destroy();

    return res.status(200).send();
  }
}
export default new StudentController();
