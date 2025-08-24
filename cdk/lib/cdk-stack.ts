import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BucketEncryption, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Distribution, ViewerProtocolPolicy, AllowedMethods, CachedMethods, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { HostedZone, IHostedZone, ARecord, AaaaRecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainName = 'griffindow.com';

    // Lookup the public hosted zone for griffindow.com in Route53
    const zone: IHostedZone = HostedZone.fromLookup(this, 'HostedZone', {
      domainName,
    });

    // Certificate for CloudFront must be in us-east-1. This creates it in us-east-1 and validates via DNS in the above zone.
    const certificate = new Certificate(this, 'SiteCertificate', {
      domainName,
      subjectAlternativeNames: [`www.${domainName}`],
      validation: CertificateValidation.fromDns(zone),
    });

    // Private S3 bucket for site content, accessible only via CloudFront
    const siteBucket = new Bucket(this, 'SiteBucket', {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    // CloudFront OAI to access the S3 bucket
    const oai = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    siteBucket.grantRead(oai);

    // CloudFront distribution with the S3 origin
    const distribution = new Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: new S3Origin(siteBucket, { originAccessIdentity: oai }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: CachedMethods.CACHE_GET_HEAD,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: Duration.minutes(5) },
      ],
      certificate,
      domainNames: [domainName, `www.${domainName}`],
      enableIpv6: true,
    });

    // Route53 aliases (A/AAAA) for apex and www -> CloudFront
    new ARecord(this, 'ApexARecord', {
      zone,
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
    new AaaaRecord(this, 'ApexAaaaRecord', {
      zone,
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
    new ARecord(this, 'WwwARecord', {
      zone,
      recordName: `www.${domainName}`,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
    new AaaaRecord(this, 'WwwAaaaRecord', {
      zone,
      recordName: `www.${domainName}`,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    // Optional: Deploy already-built static assets (e.g., Next.js export) from ../nextjs/out
    new BucketDeployment(this, 'DeployStaticSite', {
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
      sources: [Source.asset('../nextjs/out')],
      cacheControl: [CacheControl.setPublic(), CacheControl.maxAge(Duration.days(30))],
    });
  }
}
