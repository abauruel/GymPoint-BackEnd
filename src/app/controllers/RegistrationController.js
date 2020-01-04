import { addMonths, parseISO } from 'date-fns';
import * as Yup from 'yup';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import RegistrationMailJob from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          attributes: ['name'],
        },
        {
          model: Plan,
          attributes: ['title'],
        },
      ],
    });
    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      dateStart: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation is failed' });
    }
    const { dateStart, student_id, plan_id } = req.body;

    /** Check student is exist */
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student invalid' });
    }

    /**  check student is registred */
    const checkIsRegistred = await Registration.findOne({
      where: { student_id },
    });
    if (checkIsRegistred) {
      return res.status(400).json({ error: 'Student is registred' });
    }

    const plan = await Plan.findByPk(plan_id);

    /**  check plan exist */
    if (!plan) {
      return res.status(400).json({ error: 'Plan is not found' });
    }

    /** add months */
    const dateEnd = addMonths(parseISO(dateStart), plan.duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: dateStart,
      end_date: dateEnd,
      price: plan.price * plan.duration,
    });

    await Queue.add(RegistrationMailJob.key, { registration, student, plan });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      dateStart: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation is failed' });
    }

    const { plan_id, dateStart } = req.body;

    const registration = await Registration.findByPk(req.params.id);

    const plan = await Plan.findByPk(plan_id);
    const dateEnd = addMonths(parseISO(dateStart), plan.duration);

    await registration.update({
      ...req.body,
      price: plan.duration * plan.price,
      end_date: dateEnd,
    });
    return res.json(registration);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);
    await registration.destroy();
    return res.status(200).send();
  }
}

export default new RegistrationController();
