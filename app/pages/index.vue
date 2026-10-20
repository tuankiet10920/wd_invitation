<script setup>
import SlideCauroselSingleComponent from '~/coms/home/SlideCauroselSingleComponent.vue';
import ReasonComponent from '~/coms/home/ReasonComponent.vue';
import SolutionComponent from '~/coms/home/SolutionComponent.vue';
import QuestionComponent from '~/coms/home/QuestionComponent.vue';
import InvitationFromRealCustomerComponent from '~/coms/home/InvitationFromRealCustomerComponent.vue';
import InvitationTemplateComponent from '~/coms/home/InvitationTemplateComponent.vue';

const seoData = await useSeoPage('trang-chu')
useAppSeo(seoData)
</script>

<template>
    <main>
        <SlideCauroselSingleComponent />
        <InvitationTemplateComponent class="template" />
        <SolutionComponent />
        <InvitationFromRealCustomerComponent class="real" />
        <ReasonComponent />
        <QuestionComponent class="question" />
    </main>
</template>

<style scoped>
.question {
    margin: 100px 0;
}

.real {
    margin-bottom: 80px;
    margin-top: 50px;
}

.template {
    margin-top: 30px;
    margin-bottom: 65px;
}

@media (max-width: 768px) {
    .question {
        margin: 40px 0;
    }

    .real {
        margin-top: 30px;
        margin-bottom: 40px;
    }

    .template {
        margin-top: 0px;
        margin-bottom: 10px;
    }
}
</style>