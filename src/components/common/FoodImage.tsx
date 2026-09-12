import { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

export interface FoodImageProps {
  /** `data:image/...` URI from the catalogue (may be empty for some items). */
  uri: string;
  /** The existing image style (carries width/height/radius/border). */
  style: StyleProp<ImageStyle>;
  /** Fallback glyph size; defaults to a sensible fraction of a 48pt thumb. */
  fallbackIconSize?: number;
}

/**
 * Thumbnail that degrades gracefully. The bundled `fnb.json` has at least one
 * item with an empty image ("KINLEY water"), and any base64 payload can be
 * truncated — both used to render as a bare grey box. This shows a food glyph
 * in the same frame instead: immediately when the URI is too short to be an
 * image, or after the native `onError` for a payload that fails to decode.
 *
 * `erroredUri` is compared to the current `uri` (rather than a boolean) so a
 * recycled FlatList row that receives a different, valid image retries it.
 */
export function FoodImage({ uri, style, fallbackIconSize = 20 }: FoodImageProps) {
  const loadable = typeof uri === 'string' && uri.length > 64;
  const [erroredUri, setErroredUri] = useState<string | null>(null);
  const failed = !loadable || erroredUri === uri;

  if (failed) {
    return (
      <View style={[style, styles.center]}>
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={fallbackIconSize}
          color={colors.textMuted}
        />
      </View>
    );
  }

  return <Image source={{ uri }} style={style} onError={() => setErroredUri(uri)} />;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
