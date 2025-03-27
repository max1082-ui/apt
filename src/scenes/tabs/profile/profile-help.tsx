import React, {FC} from 'react';
import {Linking, ScrollView, StyleSheet} from 'react-native';

import type {ProfileHelpScreenProps} from '@navigation/types';

import {AppText, TextLink} from '@components/atoms';

import {CommonStyles} from '@styles/common';
import {WINDOW_GUTTER, SIZE_32, SIZE_8} from '@styles/sizes';

const ProfileHelpScreen: FC<ProfileHelpScreenProps> = () => (
  <ScrollView
    style={CommonStyles.fill}
    contentContainerStyle={styles.contentContainer}>
    <AppText type="h2" wrapperStyle={styles.title}>
      {'1. Как долго собранный заказ хранится в аптеке?'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'Заказ хранится в аптеке в течение трёх дней после сборки'}
    </AppText>

    <AppText type="h2" wrapperStyle={styles.title}>
      {'2. Сколько по времени собирается заказ?'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Срок подготовки товара к продаже в выбранной аптеке - до двух часов при его наличии. По готовности товара Вам будет направлено SMS-сообщение.'
      }
    </AppText>

    <AppText type="h2" wrapperStyle={styles.title}>
      {'3. Как узнать срок доставки товаров под заказ?'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'При оформлении интернет-бронирования товара Под Заказ с вами свяжется менеджер справочно-информационной службы Аптекарь.РФ и уточнит срок доставки.'
      }
    </AppText>

    <AppText type="h2" wrapperStyle={styles.title}>
      {'4. Почему не приходит SMS-сообщение о готовности заказа?'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'SMS-сообщение может не прийти по следующим причинам:'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'На вашем мобильном устройстве установлен запрет на прием SMS-сообщений с не цифровых номеров'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'На вашем мобильном устройстве недостаточно свободной памяти'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'Ваше мобильное устройство не настроено на получение SMS-сообщений'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'Некорректная работа оператора мобильной связи'}
    </AppText>
    <AppText type="bodyBold" wrapperStyle={styles.paragraph}>
      {'Решение: Устраните вышеуказанные проблемы.'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'В момент оформления интернет-заказа вы можете указать e-mail. Информация о готовности забронированного товара в выбранной вами аптеке будет дополнительно направлена на указанный вами e-mail.'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Уточнить информацию о статусе интернет-заказа по телефону справочно-информационной службы аптек «Аптекарь.РФ»'
      }
    </AppText>

    <AppText type="h2" wrapperStyle={styles.title}>
      {'5. Можно ли заказать рецептурные препараты?'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Отпуск  лекарственных средств, подлежащих рецептурному отпуску осуществляется только при предъявлении специалисту аптеки рецепта врача, оформленного в соответствии с требованиями действующего законодательства.'
      }
    </AppText>

    <AppText type="h2" wrapperStyle={styles.title}>
      {'6. Возврат и Обмен'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>{'На основании:'}</AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'Закона "О защите прав потребителей";'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Постановления Правительства РФ №55 от 19.01.1998г. (в редакции Постановлений Правительства РФ №1222 от 20.10.1998г.).'
      }
    </AppText>
    <AppText type="h2" wrapperStyle={styles.paragraph}>
      {'НЕ ПОДЛЕЖАТ ОБМЕНУ И ВОЗВРАТУ СЛЕДУЮЩИЕ ТОВАРЫ НАДЛЕЖАЩЕГО КАЧЕСТВА:'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'1. Лекарственные препараты'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        '2. Товары для профилактики и лечения заболеваний:\n- предметы санитарии и гигиены из металла, резины, текстиля и др. материалов;\n- медицинские инструменты, приборы, аппаратура;\n- средства гигиены полости рта;\n- линзы очковые;\n- предметы по уходу за детьми.'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'3. Предметы личной гигиены'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'4. Парфюмерно-косметические товары'}
    </AppText>

    <AppText type="h2" wrapperStyle={styles.title}>
      {'7. Оплата и бронирование'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Уважаемые покупатели! В нашем мобильном приложении вы легко можете забронировать нужные товары.'
      }
    </AppText>
    <AppText type="bodyBold" wrapperStyle={styles.paragraph}>
      {'Как это работает?'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        '- Собираете корзину\n- Оформляете заказ\n- Забираете готовый заказ в аптеке'
      }
    </AppText>
    <AppText type="bodyBold" wrapperStyle={styles.paragraph}>
      {'Как только заказ будет собран, вы получите смс-уведомление.'}
    </AppText>
    <AppText type="bodyBold" wrapperStyle={styles.paragraph}>
      {'Преимущества интернет-бронирования:'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        '1. Специальная цена.\n2. Быстрое оформление заказа.\n3. Получение заказа в удобное для вас время\n4. Качественные товары.\n5. Оплата заказа при получении.'
      }
    </AppText>
    <AppText type="h3" wrapperStyle={styles.paragraph}>
      {'Обратите внимание:'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Время сборки заказа: ежедневно с 9.00 до 18.00 не более 2 часов при наличии товара в аптеке.'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'Заказы к сборке принимаются ежедневно и круглосуточно.'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'Скидки по дисконтной карте не предусматриваются.'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'При наличии в корзине товаров «под заказ», мы с вами свяжемся и дополнительно уточним время сбора заказа.'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'Собранный заказ хранится в аптеке 3 дня.'}
    </AppText>

    <AppText type="h2" wrapperStyle={styles.title}>
      {'8. Оплата'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {'Оплата интернет-заказов осуществляется непосредственно в аптеке'}
    </AppText>
    <AppText type="bodyBold" wrapperStyle={styles.paragraph}>
      {'Способы оплаты при получении заказа  в аптеке:'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        '- Наличными. Оплата осуществляется непосредственно на кассе аптеки в момент выдачи заказа;\n- Оплата банковской картой. К оплате принимаются банковские карты платежных систем Visa, MasterCard, Maestro, МИР.'
      }
    </AppText>

    <AppText type="h2" wrapperStyle={styles.title}>
      {'9. Самовывоз'}
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Вы можете самостоятельно выкупить забронированные препараты в выбранной аптеке.'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Для получения забронированных товаров дождитесь СМС-уведомления о готовности заказа и сообщите специалисту номер заказа.'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Интернет-заказы принимаются круглосуточно. Обработка заказов производится согласно графику работы аптеки.'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'При фактическом наличии выбранных товаров в аптеке время сборки заказа составит не более 2 часов. Если в вашем бронировании присутствуют товары с пометкой “под заказ”, время обработки данный позиций будет увеличено.'
      }
    </AppText>
    <AppText wrapperStyle={styles.paragraph}>
      {
        'Забронированные товары доступны для самовывоза из аптеки в течение 3 дней. По истечении этого срока заказ отменяется. Если вы хотите продлить срок бронирования, позвоните в аптеку и сообщите об этом провизору.'
      }
    </AppText>

    <TextLink
      label="Наш телефон: 8 (4212) 55-00-22"
      onPress={() => {
        const link = `tel:${84212550022}`;
        Linking.canOpenURL(link)
          .then((supported) => {
            supported && Linking.openURL(link);
          })
          .catch(() => {
            return;
          });
      }}
      showArrow={false}
      wrapperStyle={styles.title}
    />

    <TextLink
      label="Email: info@aptecar.ru"
      onPress={() => {
        const link = 'mailto:info@aptecar.ru';
        Linking.canOpenURL(link)
          .then((supported) => {
            supported && Linking.openURL(link);
          })
          .catch(() => {
            return;
          });
      }}
      showArrow={false}
    />
  </ScrollView>
);

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: WINDOW_GUTTER,
    paddingVertical: SIZE_32,
  },
  title: {
    paddingVertical: SIZE_8,
  },
  paragraph: {
    marginBottom: SIZE_8,
  },
});

export default ProfileHelpScreen;
