import {VStack} from '@astryxdesign/core/VStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';

interface SectionIntroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: 'start' | 'center';
}

/** Quiet label + title + lead used at the top of every landing section. */
export function SectionIntro({eyebrow, title, lead, align = 'start'}: SectionIntroProps) {
  const isCenter = align === 'center';
  return (
    <VStack gap={2} align={isCenter ? 'center' : 'start'} maxWidth={820} className={isCenter ? 'mx-auto' : undefined}>
      <Text as="p" type="label" color="secondary">
        {eyebrow}
      </Text>
      <Heading level={2} textWrap="balance" justify={isCenter ? 'center' : 'start'}>
        {title}
      </Heading>
      {lead ? (
        <Text as="p" color="secondary" justify={isCenter ? 'center' : 'start'}>
          {lead}
        </Text>
      ) : null}
    </VStack>
  );
}
