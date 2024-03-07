import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Popins} from '../../components/popins';
import {ScrollViewTw} from '../../types/type';

export const TermsAndAgreementScreen: React.FC = () => {
  const text = React.useState('');
  return (
    <ScrollViewTw style={styles.container}>
      <StatusBar
        backgroundColor={'#000'}
        barStyle={'light-content'}
        translucent
      />
      <Text
        style={[
          styles.text700,
          {marginBottom: 24, marginTop: 24, fontSize: 16},
        ]}>
        APPLE INC{'\n'}
        iOS AND iPadOS SOFTWARE LICENSE AGREEMENT
      </Text>
      <Text style={[styles.text400, {marginBottom: 36}]}>
        {'\t'}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        posuere scelerisque vehicula. Donec eleifend a felis vel mollis. In
        sagittis tempus odio, quis mollis sem finibus sed. Morbi egestas a leo
        ut varius. Fusce eleifend, odio eu sollicitudin lacinia, risus nisi
        euismod turpis, id accumsan lorem quam quis tortor. Vivamus luctus,
        velit at tristique lacinia, neque nunc efficitur justo, quis bibendum
        eros ligula eu dui. Curabitur rhoncus quis lacus et accumsan.{'\n'}
        {'\n'}
        {'\t'}Morbi sed purus non elit accumsan posuere posuere ut nibh. Aenean
        sed dolor sit amet risus viverra auctor tristique vel nibh. Sed commodo
        facilisis tortor. Curabitur facilisis enim at tortor semper elementum.
        Aliquam venenatis, erat sed interdum elementum, lorem justo tincidunt
        lectus, id interdum lorem leo vitae nunc. Donec vel tempus nibh. Cras id
        feugiat arcu. Nulla condimentum posuere odio et imperdiet.{'\n'}
        {'\n'}
        {'\t'}In molestie lorem ac tempus facilisis. Donec ac luctus ex. Proin
        vitae lacinia odio. Fusce cursus convallis convallis. In at risus
        ultrices, consectetur nibh sed, dictum sapien. Cras lacinia viverra
        velit at dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Aliquam nibh libero, molestie eu risus non, pellentesque
        ullamcorper est. Class aptent taciti sociosqu ad litora torquent per
        conubia nostra, per inceptos himenaeos.{'\n'}
        {'\n'}
        {'\t'}Nullam elit dui, pulvinar in leo vel, fermentum fermentum augue.
        Vivamus vitae nibh porttitor, feugiat justo sed, vestibulum risus. Duis
        euismod vehicula sollicitudin. Nulla venenatis, ante a rutrum
        condimentum, ipsum augue tempor est, eget pulvinar felis velit ut ante.
        Phasellus suscipit, risus non imperdiet ornare, mi velit venenatis
        velit, ut lobortis metus velit non elit. Nulla posuere metus sit amet
        tellus accumsan, vel fringilla nibh faucibus. Integer vel enim sit amet
        ex bibendum pellentesque vitae non dolor. Aliquam blandit purus eget
        lacus eleifend, quis porttitor massa semper. Class aptent taciti
        sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
        Nulla placerat dui augue, et posuere sem fermentum ac. Cras tempor, sem
        nec varius luctus, nisl mauris egestas purus, sed bibendum neque libero
        id magna. Maecenas ultrices neque sollicitudin, ornare purus a,
        consequat quam. Pellentesque nibh dui, mollis a euismod nec, egestas
        suscipit justo. Donec in sem tristique, convallis nulla ut, iaculis
        tortor.{'\n'}
        {'\n'}
        {'\t'}Nunc sagittis sagittis eleifend. Cras vitae dolor vitae velit
        rhoncus congue sed id lacus. Curabitur malesuada est ut feugiat laoreet.
        Phasellus ultricies euismod dui quis vulputate. Integer ut aliquet
        tellus, sit amet rhoncus erat. Quisque pellentesque lacus felis, sit
        amet sodales risus fringilla ac. Donec suscipit ut elit at auctor. Sed
        id mi blandit turpis tristique eleifend. Phasellus vel libero vel risus
        porttitor congue. Phasellus tempus turpis at sapien laoreet, nec
        vulputate orci dignissim.{'\n'}
        {'\n'}
        {'\t'}Morbi nec fringilla lectus. Curabitur et diam nec lacus viverra
        dictum dapibus ac ex. Nullam fringilla tristique sollicitudin. Sed est
        tortor, varius eget vestibulum eget, tristique eget leo. Nam scelerisque
        felis ante, non aliquam leo finibus id. Donec sed quam sit amet odio
        semper euismod. Cras sodales quam velit, sit amet lobortis ex pretium
        vitae. Pellentesque facilisis nisl tortor, quis tempor lacus
        sollicitudin non. Quisque aliquam luctus imperdiet. Morbi id dapibus
        arcu, sit amet viverra augue. Fusce congue, ante sed faucibus rutrum,
        ipsum eros viverra urna, vel tempor erat nunc quis massa. Nulla mattis a
        turpis a mattis.{'\n'}
        {'\n'}
        {'\t'}Nam augue sapien, viverra tincidunt neque quis, cursus porta
        tellus. Sed varius quis justo et tristique. Proin auctor sit amet erat
        sed scelerisque. Praesent laoreet lobortis nibh, id egestas lacus
        elementum nec. Proin vel pulvinar dui. Integer leo odio, tincidunt vel
        dignissim sit amet, molestie at quam. Praesent dignissim, nibh nec
        dictum interdum, augue elit cursus quam, vitae dapibus massa arcu quis
        ligula. Pellentesque auctor nisl tellus, sed iaculis mi convallis id.
        Praesent tincidunt non ligula a euismod. Etiam ornare facilisis lacus,
        ac vulputate ex interdum in.{'\n'}
        {'\n'}
        {'\t'}Duis commodo lorem ac interdum porta. Etiam viverra sit amet arcu
        quis aliquam. Nunc posuere, sapien luctus vulputate bibendum, felis sem
        condimentum dui, ut suscipit lorem sapien et arcu. Praesent nec aliquam
        urna, at bibendum orci. Sed libero massa, hendrerit feugiat libero eu,
        facilisis hendrerit orci. Etiam feugiat massa diam, hendrerit pulvinar
        ipsum pharetra nec. Aenean porttitor quam est, elementum sollicitudin
        turpis mattis non. Aliquam pulvinar ipsum at scelerisque tempor.
        Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin
        mattis ex quis posuere lacinia.{'\n'}
        {'\n'}
        {'\t'}Sed gravida sem maximus, posuere nulla et, sollicitudin arcu.
        Nullam ornare, lectus sed interdum convallis, orci risus lobortis odio,
        ac commodo leo felis ut dui. Mauris dictum euismod fermentum. Maecenas
        metus dolor, vestibulum et venenatis sit amet, tincidunt a erat. Etiam
        malesuada dignissim dapibus. Cras finibus mi non condimentum facilisis.
        Aenean finibus varius pulvinar. Nunc in consectetur sapien. Etiam
        aliquam viverra sem et placerat. Ut at odio quis metus aliquam viverra
        non lacinia elit. Etiam mi nibh, malesuada sit amet dapibus sed, tempor
        eu metus. Fusce eget volutpat velit. Morbi et nibh imperdiet justo
        elementum facilisis id mattis justo.{'\n'}
        {'\n'}
        {'\t'}Nunc sed tellus mi. Pellentesque et mi condimentum, volutpat nibh
        non, luctus sapien. Maecenas tincidunt vestibulum iaculis. Morbi
        eleifend viverra lacus, vehicula dignissim nunc ultricies sit amet.
        Maecenas eu suscipit libero. Quisque hendrerit, dolor eu finibus
        bibendum, nisl nulla ultricies metus, in aliquet felis est at tortor.
        Duis molestie fringilla velit, a dignissim diam lobortis et. Phasellus
        rhoncus bibendum libero, ac porttitor quam viverra non. Nam eu fringilla
        erat. Cras luctus feugiat mi, volutpat sodales turpis lacinia a. Sed
        augue odio, tincidunt posuere fringilla a, cursus ut mi.{'\n'}
        {'\n'}
        {'\t'}Nulla pellentesque non mauris eu ultricies. Duis vitae neque sit
        amet dui semper mattis. Aliquam rutrum tristique interdum. Vestibulum
        dui sem, eleifend sodales ultricies vitae, facilisis et tellus. Praesent
        vitae lectus id magna blandit dictum vitae non ipsum. Etiam dignissim
        dolor id convallis ultricies. Vivamus at dolor cursus, scelerisque quam
        non, efficitur purus. Fusce pretium, elit sit amet pellentesque
        tristique, est purus fermentum lorem, nec euismod est orci vitae dui.
        Nunc in eros sem. Ut eget hendrerit velit, id scelerisque mi. Nullam
        euismod metus vitae est suscipit, vel cursus mi cursus. Maecenas
        efficitur a tellus vel blandit.{'\n'}
        {'\n'}
        {'\t'}Nulla facilisi. Praesent aliquam lorem at vulputate faucibus.
        Phasellus luctus nisl dolor, non blandit enim lacinia quis. Donec
        ultrices purus et.{'\n'}
        {'\n'}
        {'\t'}Generated 12 paragraphs, 1000 words, 6720 bytes of Lorem Ipsum
      </Text>
    </ScrollViewTw>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    paddingBottom: 50,
  },
  text: {
    color: '#192e51',
  },
  textCenter: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  text400: {
    color: '#192e51',
    fontFamily: Popins[400],
    top: 1.8,
  },
  text500: {
    color: '#192e51',
    fontFamily: Popins[500],
    top: 2,
  },
  text700: {
    color: '#192e51',
    fontFamily: Popins[700],
    top: 2.1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeContainerNomal: {
    borderRadius: 20,
    width: '100%',
    height: 58,
  },
});
