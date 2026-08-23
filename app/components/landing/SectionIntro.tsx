import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';

interface SectionIntroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: 'start' | 'center';
}

/** Eyebrow + title + lead used at the top of every landing section. */
export function SectionIntro({eyebrow, title, lead, align = 'start'}: SectionIntroProps) {
  const isCenter = align === 'center';
  return (
    <VStack gap={2} align={isCenter ? 'center' : 'start'} maxWidth={820}>
      <HStack gap={2} vAlign="center">
        <HStack width={28} height={3} className="rounded-full bg-accent" />
        <Text
          as="p"
          weight="bold"
          className="text-[13px] uppercase tracking-widest text-blue-vivid"
        >
          {eyebrow}
        </Text>
      </HStack>
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
