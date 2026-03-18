import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const survey = await prisma.surveyResponse.findUnique({
    where: { id: 'cmmw9j8au0003v8xsp72jitko' }
  });

  if (!survey) {
    console.log('Survey not found');
    return;
  }

  console.log('INTRA:', JSON.stringify(survey.intralaboralData, null, 2));
  console.log('EXTRA:', JSON.stringify(survey.extralaboralData, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
