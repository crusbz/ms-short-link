import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import 'dotenv/config';

const exporterOptions = {
  url: process.env.JAEGER_URL_GRPC,
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

export const otelSDK = new NodeSDK({
  resource: new Resource({
    'service.name': 'nest-app-microservice',
  }),
  spanProcessor: new SimpleSpanProcessor(traceExporter),
  instrumentations: [
    new ExpressInstrumentation(),
    new HttpInstrumentation(),
    new NestInstrumentation(),
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
