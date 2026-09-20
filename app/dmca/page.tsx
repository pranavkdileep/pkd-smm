import { Metadata } from 'next';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Divider } from '@astryxdesign/core/Divider';
import { Badge } from '@astryxdesign/core/Badge';
import { LegalPageShell } from '@/app/components/legal/LegalPageShell';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: `DMCA & Copyright Policy · ${siteConfig.name}`,
  description: `Digital Millennium Copyright Act (17 U.S.C. § 512) notice and takedown procedure, designated copyright agent, and repeat infringer policy for ${siteConfig.name}.`,
};

export default function DmcaPage() {
  return (
    <LegalPageShell
      title="DMCA Copyright & Takedown Policy"
      subtitle={`Statutory notice and takedown guidelines, safe harbor compliance under 17 U.S.C. § 512, designated copyright agent details, and repeat infringer enforcement.`}
      effectiveDate={siteConfig.legal.effectiveDate}
      jurisdictions={['United States 17 U.S.C. § 512', 'WIPO Copyright Treaty', 'EU eCommerce Directive safe harbor']}
    >
      <VStack gap={6} align="start" className="w-full">
        {/* Section 1: Overview */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>1. Notice and Takedown Framework</Heading>
          <Text as="p" color="secondary">
            <strong className="text-primary">{siteConfig.name}</strong> respects the intellectual property rights of creators,
            artists, and copyright holders. In accordance with the <strong className="text-primary">Digital Millennium Copyright Act of 1998
            (17 U.S.C. § 512) (&quot;DMCA&quot;)</strong> and international copyright treaties, we maintain an expeditious notice-and-takedown
            procedure to address claims of intellectual property infringement.
          </Text>
        </VStack>

        <Divider />

        {/* Section 2: Designated Agent */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>2. Designated DMCA Copyright Agent</Heading>
          <Text as="p" color="secondary">
            All formal notifications of claimed copyright infringement must be submitted in writing to our Designated Copyright Agent:
          </Text>

          <VStack gap={2} className="w-full rounded-lg border border-border bg-card p-4">
            <HStack gap={2} vAlign="center">
              <Badge variant="blue" label="Official Agent" />
              <Text size="sm" weight="bold">DMCA Legal & Copyright Compliance Department</Text>
            </HStack>
            <Text size="sm" color="secondary">
              Platform: <strong className="text-primary">{siteConfig.name}</strong>
            </Text>
            <Text size="sm" color="secondary">
              Attn: Copyright Agent / Legal Counsel
            </Text>
            <Text size="sm" color="secondary">
              Email Address: <Text as="span" weight="semibold" color="primary">{siteConfig.email.dmca}</Text>
            </Text>
            <Text size="sm" color="secondary">
              Physical Mail: Legal Department, {siteConfig.legal.companyName}, Compliance Division
            </Text>
          </VStack>
        </VStack>

        <Divider />

        {/* Section 3: Takedown Notification Requirements */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>3. Statutory Requirements for a DMCA Takedown Notice</Heading>
          <Text as="p" color="secondary">
            Under 17 U.S.C. § 512(c)(3), a valid notification of claimed infringement must include substantially the following:
          </Text>

          <VStack gap={2} className="w-full">
            <Text size="sm" color="secondary">
              1. <strong className="text-primary">Physical or Electronic Signature:</strong> A signature of a person authorized to act on behalf
              of the owner of an exclusive right that is allegedly infringed.
            </Text>
            <Text size="sm" color="secondary">
              2. <strong className="text-primary">Identification of Copyrighted Work:</strong> A description or URL of the copyrighted work claimed
              to have been infringed, or a representative list if multiple works are involved.
            </Text>
            <Text size="sm" color="secondary">
              3. <strong className="text-primary">Identification of Infringing Material:</strong> Specific URLs or identifiers on our platform
              alleged to be infringing or the subject of infringing activity, sufficiently detailed for us to locate the material.
            </Text>
            <Text size="sm" color="secondary">
              4. <strong className="text-primary">Contact Information:</strong> Information reasonably sufficient to permit us to contact you
              (including name, physical address, telephone number, and email address).
            </Text>
            <Text size="sm" color="secondary">
              5. <strong className="text-primary">Statement of Good Faith:</strong> A statement that you have a good faith belief that use of the
              material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
            </Text>
            <Text size="sm" color="secondary">
              6. <strong className="text-primary">Statement Under Penalty of Perjury:</strong> A statement that the information in the notification
              is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.
            </Text>
          </VStack>
          <Text as="p" color="secondary">
            Please note that under Section 512(f), any person who knowingly materially misrepresents that material is infringing may be subject
            to liability for damages and attorneys&apos; fees.
          </Text>
        </VStack>

        <Divider />

        {/* Section 4: Counter-Notice Procedure */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>4. Counter-Notice Procedure for Users</Heading>
          <Text as="p" color="secondary">
            If you believe your content or target link was mistakenly removed or disabled as a result of a mistaken DMCA notice, you may submit
            a written Counter-Notice to our Designated Agent pursuant to 17 U.S.C. § 512(g)(3).
          </Text>
          <Text as="p" color="secondary">
            Your Counter-Notice must include your physical or electronic signature, identification of the material removed, a statement under
            penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification, and your consent to the
            jurisdiction of federal district court.
          </Text>
        </VStack>

        <Divider />

        {/* Section 5: Repeat Infringer Policy */}
        <VStack gap={3} align="start" className="w-full">
          <Heading level={2}>5. Repeat Infringer Policy</Heading>
          <Text as="p" color="secondary">
            In compliance with 17 U.S.C. § 512(i)(1)(A), {siteConfig.name} enforces a strict <strong className="text-primary">Repeat Infringer Policy</strong>.
            We will, in appropriate circumstances and at our sole discretion, terminate the accounts of users who are determined to be repeat infringers
            of intellectual property rights, without refund of any outstanding wallet balances.
          </Text>
        </VStack>
      </VStack>
    </LegalPageShell>
  );
}
