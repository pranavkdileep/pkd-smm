'use client';

import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';

import { FAQS } from './content';
import { SectionIntro } from './SectionIntro';

export function Faq() {
  return (
    <section id="faq" aria-label="Frequently asked questions" className="scroll-mt-24 border-t border-border bg-body py-14 md:py-20">
      <VStack maxWidth={900} gap={8} className="mx-auto w-full px-6">
        <SectionIntro
          eyebrow="FAQ"
          title="Questions about the panel itself"
          align="center"
        />

        {/* The group owns open state for valued items  first FAQ open by default. */}
        <CollapsibleGroup type="single" defaultValue="0">
          {FAQS.map((faq, index) => (
            <Collapsible
              key={faq.q}
              value={String(index)}
              trigger={
                <HStack gap={3} vAlign="center">
                  <HStack
                    hAlign="center"
                    vAlign="center"
                    className="size-7 shrink-0 rounded-md border border-border bg-surface"
                  >
                    <Text size="xsm" weight="semibold" hasTabularNumbers>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </HStack>
                  <Text weight="semibold">{faq.q}</Text>
                </HStack>
              }
            >
              <Text as="p" size="sm" color="secondary">
                {faq.a}
              </Text>
            </Collapsible>
          ))}
        </CollapsibleGroup>
      </VStack>
    </section>
  );
}
