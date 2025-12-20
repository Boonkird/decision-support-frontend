import { Routes } from '@angular/router';
import { IntroComponent } from './pages/intro/intro.component';
import { StudentInfoComponent } from './pages/student-info/student-info.component';
import { SurveyComponent } from './pages/survey/survey.component';
import { ResultComponent } from './pages/result/result.component';

export const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'student-info', component: StudentInfoComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'result', component: ResultComponent },
  { path: '**', redirectTo: '' },
];
