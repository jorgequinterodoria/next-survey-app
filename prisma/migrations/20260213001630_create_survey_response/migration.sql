-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "consentName" TEXT NOT NULL,
    "consentDoc" TEXT NOT NULL,
    "consentAccepted" BOOLEAN NOT NULL,
    "formType" TEXT NOT NULL,
    "fichaData" JSONB NOT NULL,
    "intralaboralData" JSONB NOT NULL,
    "extralaboralData" JSONB NOT NULL,
    "estresData" JSONB NOT NULL,
    "filters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);
