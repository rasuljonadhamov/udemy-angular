import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context?: any) => bootstrapApplication(App, config, context);

export default bootstrap;
