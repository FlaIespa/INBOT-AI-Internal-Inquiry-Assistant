// src/components/TranslationPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define your styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
    fontFamily: 'Times-Roman',
    lineHeight: 1.15,
  },
  section: {
    marginBottom: 10,
  },
  text: {
    marginBottom: 4,
  },
});

// TranslationPDF component takes the translation text and file name as props
const TranslationPDF = ({ translation }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text>{translation}</Text>
      </View>
    </Page>
  </Document>
);

export default TranslationPDF;
