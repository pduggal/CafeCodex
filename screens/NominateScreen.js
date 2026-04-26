import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/colors';
import { supabase } from '../lib/supabase';

export default function NominateScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nominationData, setNominationData] = useState(null);
  const [form, setForm] = useState({
    cafe_name: '', city: '', country: '', neighborhood: '',
    what_makes_it_special: '', must_order: '', best_time: '',
    your_name: '', instagram_handle: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const isValid = form.cafe_name && form.city && form.country &&
    form.what_makes_it_special && form.must_order && form.your_name;

  const submit = async () => {
    if (!isValid) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from('nominations').insert({
        cafe_name: form.cafe_name.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        neighborhood: form.neighborhood.trim() || null,
        what_makes_it_special: form.what_makes_it_special.trim(),
        must_order: form.must_order.trim(),
        best_time: form.best_time.trim() || null,
        your_name: form.your_name.trim(),
        instagram_handle: form.instagram_handle.trim() || null,
      });
    } catch (e) {
      console.log('Supabase nomination insert failed:', e);
    }
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'df232092-355f-4f5c-8d0a-70b739d24294',
          subject: '☕ New Café Codex Nomination: ' + form.cafe_name.trim(),
          from_name: 'Café Codex',
          'Café': form.cafe_name.trim(),
          'City': form.city.trim(),
          'Country': form.country.trim(),
          'Neighborhood': form.neighborhood.trim() || '—',
          'What makes it special': form.what_makes_it_special.trim(),
          'Must order': form.must_order.trim(),
          'Best time': form.best_time.trim() || '—',
          'Nominated by': form.your_name.trim(),
          'Instagram': form.instagram_handle.trim() || '—',
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Email delivery failed');
      setNominationData(form);
      setSubmitted(true);
    } catch (e) {
      console.log('Web3Forms email failed:', e);
      Alert.alert(
        'Could not send nomination',
        'Please check your connection and try again. If the problem persists, DM @honestcoffeestop on Instagram.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const shareNomination = async () => {
    const d = nominationData;
    const text = `Just nominated ${d.cafe_name} in ${d.city} to @honestcoffeestop's Café Codex ✦☕\n\nHope it makes the list! https://pduggal.github.io/CafeCodex`;
    try {
      await Share.share({ message: text });
    } catch {
      try {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied!', 'Nomination text copied to clipboard.');
      } catch {}
    }
  };

  const reset = () => {
    setSubmitted(false);
    setNominationData(null);
    setForm({
      cafe_name: '', city: '', country: '', neighborhood: '',
      what_makes_it_special: '', must_order: '', best_time: '',
      your_name: '', instagram_handle: '',
    });
  };

  const toTitleCase = (str) =>
    str.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  if (submitted && nominationData) {
    const handle = nominationData.instagram_handle
      ? nominationData.instagram_handle.replace(/^@/, '')
      : null;
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.successWrap}>
          <Text style={styles.successIcon}>✦</Text>
          <Text style={styles.successTitle}>Nomination sent!</Text>
          <Text style={styles.successMsg}>
            Pallavi will review it. If it makes the Codex, your name goes on the map.
          </Text>

          <View style={styles.draftCard}>
            <Text style={styles.draftLabel}>🤝 Community Nomination</Text>
            <Text style={styles.draftName}>{nominationData.cafe_name}</Text>
            <Text style={styles.draftLoc}>
              {nominationData.neighborhood ? `${nominationData.neighborhood} · ` : ''}
              {nominationData.city}, {toTitleCase(nominationData.country)}
            </Text>
            <Text style={styles.draftBy}>
              Nominated by {toTitleCase(nominationData.your_name)}
              {handle ? ` · @${handle}` : ''}
            </Text>
          </View>

          <TouchableOpacity style={styles.shareBtn} onPress={shareNomination}>
            <Text style={styles.shareBtnText}>📤 Share your nomination</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={reset}>
            <Text style={styles.backBtnText}>Nominate another</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nominate a Café ✦</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.formWrap}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.introHeadline}>Know a place that belongs in the Codex?</Text>
        <Text style={styles.introSub}>
          Tell Pallavi about it. If it makes the cut, you'll be credited as the one who found it.
        </Text>

        <Text style={styles.sectionLabel}>The Café</Text>
        <FormField label="Café name" required value={form.cafe_name} onChange={(v) => update('cafe_name', v)} placeholder="e.g. Onibus Coffee" />
        <View style={styles.formRow}>
          <View style={styles.formRowHalf}>
            <FormField label="City" required value={form.city} onChange={(v) => update('city', v)} placeholder="e.g. Tokyo" />
          </View>
          <View style={styles.formRowHalf}>
            <FormField label="Country" required value={form.country} onChange={(v) => update('country', v)} placeholder="e.g. Japan" />
          </View>
        </View>
        <FormField label="Neighborhood" value={form.neighborhood} onChange={(v) => update('neighborhood', v)} placeholder="e.g. Nakameguro" />

        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>Your honest take</Text>
        <FormField
          label="What makes it honest?"
          required multiline
          value={form.what_makes_it_special}
          onChange={(v) => update('what_makes_it_special', v)}
          placeholder="Why does this cafe belong in the Codex?"
        />
        <FormField label="Must order" required value={form.must_order} onChange={(v) => update('must_order', v)} placeholder="e.g. The ceremonial matcha bowl" />
        <FormField label="Best time to go" value={form.best_time} onChange={(v) => update('best_time', v)} placeholder="e.g. Weekday mornings" />

        <View style={styles.divider} />
        <Text style={styles.sectionLabel}>Credit</Text>
        <FormField label="Your name" required value={form.your_name} onChange={(v) => update('your_name', v)} placeholder="First name or nickname" />
        <FormField label="Your @handle" value={form.instagram_handle} onChange={(v) => update('instagram_handle', v)} placeholder="@yourhandle" />

        <TouchableOpacity
          style={[styles.submitBtn, (!isValid || submitting) && styles.submitBtnDisabled]}
          onPress={submit}
          disabled={!isValid || submitting}
        >
          <Text style={styles.submitBtnText}>{submitting ? 'Sending…' : 'Send to Pallavi ✦'}</Text>
        </TouchableOpacity>
        <Text style={styles.submitNote}>
          Pallavi personally reviews every nomination. If it makes the Codex, you'll be credited.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function FormField({ label, required, multiline, value, onChange, placeholder }) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>
        {label} {required ? <Text style={styles.formReq}>*</Text> : <Text style={styles.formOpt}>optional</Text>}
      </Text>
      <TextInput
        style={[styles.formInput, multiline && styles.formTextarea]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.cream },
  formWrap: { padding: 24, paddingBottom: 40 },
  introHeadline: { color: Colors.primary, fontSize: 20, fontWeight: '800', lineHeight: 26, marginBottom: 8 },
  introSub: { color: Colors.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 28 },
  sectionLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 },
  formGroup: { marginBottom: 18 },
  formLabel: { color: Colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 7 },
  formReq: { color: Colors.textMuted, fontWeight: '400', textTransform: 'none', letterSpacing: 0, fontSize: 10 },
  formOpt: { color: Colors.textMuted, fontWeight: '400', textTransform: 'none', letterSpacing: 0, fontSize: 10 },
  formInput: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 10, padding: 12, paddingHorizontal: 14, color: Colors.cream, fontSize: 15,
  },
  formTextarea: { minHeight: 80, paddingTop: 12 },
  formRow: { flexDirection: 'row', gap: 12 },
  formRowHalf: { flex: 1 },
  divider: { height: 1, backgroundColor: Colors.cardBorder, marginVertical: 24 },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 6,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: Colors.background, fontSize: 16, fontWeight: '800' },
  submitNote: { textAlign: 'center', color: Colors.textMuted, fontSize: 12, marginTop: 10, lineHeight: 18 },

  successWrap: { padding: 40, paddingTop: 60, alignItems: 'center' },
  successIcon: { fontSize: 52, marginBottom: 18, color: Colors.primary },
  successTitle: { color: Colors.cream, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  successMsg: { color: Colors.textMuted, fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 28 },
  draftCard: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.primary,
    borderRadius: 14, padding: 16, width: '100%', marginBottom: 24,
  },
  draftLabel: { color: Colors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  draftName: { color: Colors.white, fontSize: 19, fontWeight: '800', marginBottom: 4 },
  draftLoc: { color: Colors.textMuted, fontSize: 13, marginBottom: 8 },
  draftBy: { color: Colors.success, fontSize: 12, fontStyle: 'italic' },
  shareBtn: {
    width: '100%', backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.primary,
    borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 10,
  },
  shareBtnText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
  backBtn: {
    width: '100%', backgroundColor: Colors.primary, borderRadius: 12, padding: 13, alignItems: 'center',
  },
  backBtnText: { color: Colors.background, fontSize: 14, fontWeight: '700' },
});
