import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnsweredMail {
  get key() {
    return 'AnsweredMail';
  }

  async handle({ data }) {
    const { name, email, help_order_answered } = data;
    await Mail.sendMail({
      to: email,
      subject: 'Resposta de auxilio',
      template: 'answered',
      context: {
        name,
        question: help_order_answered.question,
        answer: help_order_answered.answer,
        date: format(parseISO(help_order_answered.answer_at), 'dd/MM/yyyy', {
          locale: pt,
        }),
      },
    });
  }
}
export default new AnsweredMail();
