import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration, student, plan } = data;
    await Mail.sendMail({
      to: student.email,
      subject: 'Confirmação de Matricula',
      template: 'registration',
      context: {
        name: student.name,
        price: registration.price,
        planName: plan.title,
        planDuration: plan.duration,
        mes: plan.duration > 1 ? 'meses' : 'mês',
        date_end: format(parseISO(registration.end_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
      },
    });
  }
}
export default new RegistrationMail();
