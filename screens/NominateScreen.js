import React, { useState, useRef } from 'react';
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
import { useCafes } from '../context/CafeContext';

export default function NominateScreen() {
  const { cafes, countries } = useCafes();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nominationData, setNominationData] = useState(null);
  const [countryConfirmed, setCountryConfirmed] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityRef = useRef(null);
  const [form, setForm] = useState({
    cafe_name: '', city: '', country: '', neighborhood: '',
    what_makes_it_special: '', must_order: '', best_time: '',
    your_name: '', instagram_handle: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const filterCountries = (query) => {
    if (!query || query.length < 1) return [];
    const lq = query.toLowerCase().trim();
    return (countries || [])
      .filter((c) => {
        if (c.name.toLowerCase().includes(lq)) return true;
        return (c.aliases || []).some((a) => a.toLowerCase().includes(lq));
      })
      .slice(0, 6)
      .map((c) => ({ name: c.name, flag: c.flag || '🌍' }));
  };

  const filterCities = (query, selectedCountry) => {
    if (!query || query.length < 1) return [];
    const lq = query.toLowerCase().trim();
    const citySet = new Set();
    const results = [];
    if (selectedCountry) {
      (cafes || []).forEach((c) => {
        if (c.country === selectedCountry && c.city && c.city.toLowerCase().includes(lq) && !citySet.has(c.city)) {
          citySet.add(c.city);
          results.push(c.city);
        }
      });
      const cd = (countries || []).find((c) => c.name === selectedCountry);
      if (cd) {
        [...(cd.cities || []), ...(cd.planned_cities || [])].forEach((city) => {
          if (city.toLowerCase().includes(lq) && !citySet.has(city)) {
            citySet.add(city);
            results.push(city);
          }
        });
      }
    } else {
      (cafes || []).forEach((c) => {
        if (c.city && c.city.toLowerCase().includes(lq) && !citySet.has(c.city)) {
          citySet.add(c.city);
          results.push(c.city);
        }
      });
    }
    return results.slice(0, 6);
  };

  const isValid = form.cafe_name && form.city && form.country &&
    form.what_makes_it_special && form.must_order && form.your_name;

  const submit = async () => {
    if (!isValid) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (!countryConfirmed) {
      const match = (countries || []).find((c) => c.name.toLowerCase() === form.country.trim().toLowerCase());
      if (match) {
        update('country', match.name);
        setCountryConfirmed(true);
      } else {
        Alert.alert('Invalid country', 'Please select a valid country from the suggestions.');
        setSubmitting(false);
        return;
      }
    }
    setSubmitting(true);
    let sent = false;
    try {
      const { error } = await supabase.from('nominations').insert({
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
      if (!error) sent = true;
    } catch (e) {
    }
    const n = form;
    const msg = `☕ *New Café Codex Nomination*\n\n☕ *Café:* ${n.cafe_name.trim()}\n📍 *City:* ${n.city.trim()}, ${n.country.trim()}\n🏘 *Neighborhood:* ${n.neighborhood.trim() || '—'}\n\n✨ *What makes it special:* ${n.what_makes_it_special.trim()}\n🥤 *Must order:* ${n.must_order.trim()}\n⏰ *Best time:* ${n.best_time.trim() || '—'}\n\n🙋 *Nominated by:* ${n.your_name.trim()}\n📸 *Instagram:* ${n.instagram_handle.trim() ? '@' + n.instagram_handle.trim().replace(/^@/, '') : '—'}`;
    try {
      const res = await fetch('https://api.telegram.org/bot8700866491:AAGrVpFUTbez0b97siu1eAyADUTD980qVB0/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: 776680806, text: msg, parse_mode: 'Markdown' }),
      });
      if (res.ok) sent = true;
    } catch (_) {}
    if (sent) {
      setNominationData(form);
      setSubmitted(true);
    } else {
      Alert.alert(
        'Could not send nomination',
        'Please check your connection and try again. If the problem persists, DM @honestcoffeestop on Instagram.'
      );
    }
    setSubmitting(false);
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
    setCountryConfirmed(false);
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
        <View style={{ zIndex: 3 }}>
          <SearchableField
            label="Country"
            required
            value={form.country}
            onChangeText={(v) => {
              update('country', v);
              setCountryConfirmed(false);
              setShowCountryDropdown(v.length >= 1);
              if (form.city) update('city', '');
            }}
            onSelect={(item) => {
              update('country', item.name);
              setCountryConfirmed(true);
              setShowCountryDropdown(false);
              if (form.city) update('city', '');
              setTimeout(() => cityRef.current?.focus(), 100);
            }}
            onClear={() => {
              update('country', '');
              setCountryConfirmed(false);
              setShowCountryDropdown(false);
              update('city', '');
            }}
            options={showCountryDropdown ? filterCountries(form.country) : []}
            placeholder="e.g. Japan"
            showDropdown={showCountryDropdown && filterCountries(form.country).length > 0}
            renderItem={(item) => (
              <>
                <Text style={styles.dropdownFlag}>{item.flag}</Text>
                <Text style={styles.dropdownText}>{item.name}</Text>
              </>
            )}
          />
        </View>
        <View style={{ zIndex: 2 }}>
          <SearchableField
            label="City"
            required
            value={form.city}
            inputRef={cityRef}
            onChangeText={(v) => {
              update('city', v);
              setShowCityDropdown(v.length >= 1);
            }}
            onSelect={(city) => {
              update('city', city);
              setShowCityDropdown(false);
            }}
            onClear={() => {
              update('city', '');
              setShowCityDropdown(false);
            }}
            options={showCityDropdown ? filterCities(form.city, countryConfirmed ? form.country : null) : []}
            placeholder="e.g. Tokyo"
            showDropdown={showCityDropdown && filterCities(form.city, countryConfirmed ? form.country : null).length > 0}
            renderItem={(city) => (
              <Text style={styles.dropdownText}>{city}</Text>
            )}
          />
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

function SearchableField({ label, required, value, onChangeText, onSelect, onClear, options, placeholder, showDropdown, renderItem, inputRef }) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>
        {label} {required ? <Text style={styles.formReq}>*</Text> : <Text style={styles.formOpt}>optional</Text>}
      </Text>
      <View style={styles.searchInputWrap}>
        <TextInput
          ref={inputRef}
          style={styles.formInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
        />
        {value ? (
          <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {showDropdown ? (
        <View style={styles.dropdown}>
          {options.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dropdownItem, i === options.length - 1 && styles.dropdownItemLast]}
              onPress={() => onSelect(item)}
            >
              {renderItem(item)}
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
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
  searchInputWrap: { position: 'relative' },
  clearBtn: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' },
  clearBtnText: { color: Colors.textMuted, fontSize: 16 },
  dropdown: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 10, marginTop: 4, overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  dropdownItemLast: { borderBottomWidth: 0 },
  dropdownFlag: { fontSize: 18 },
  dropdownText: { color: Colors.cream, fontSize: 15 },
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
