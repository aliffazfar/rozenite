import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { ScrollArea } from '../components/ScrollArea';
import { Section } from '../components/Section';
import { CookieCard } from '../components/CookieCard';
import {
  parseRequestCookiesFromHeaders,
  parseResponseCookiesFromHeaders,
} from '../../utils/cookieParser';
import { HttpNetworkEntry, SSENetworkEntry } from '../state/model';

export type CookiesTabProps = {
  selectedRequest: HttpNetworkEntry | SSENetworkEntry;
};

export const CookiesTab = ({ selectedRequest }: CookiesTabProps) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const requestHeaders = selectedRequest.request?.headers;
  const responseHeaders = selectedRequest.response?.headers;

  const { requestCookies, responseCookies } = React.useMemo(() => {
    return {
      requestCookies: parseRequestCookiesFromHeaders(requestHeaders || {}),
      responseCookies: parseResponseCookiesFromHeaders(responseHeaders || {}),
    };
  }, [requestHeaders, responseHeaders]);

  const hasRequestCookies = requestCookies.length > 0;
  const hasResponseCookies = responseCookies.length > 0;

  if (!hasRequestCookies && !hasResponseCookies) {
    return (
      <ScrollArea className="h-full w-full">
        <div className="p-4">
          <div className={`text-sm ${colors.textMuted}`}>
            No cookies for this request
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4">
        <div className="space-y-6">
          {hasRequestCookies && (
            <Section
              title={`Request Cookies (${requestCookies.length})`}
            >
              <div className="space-y-2">
                {requestCookies.map((cookie, index) => (
                  <CookieCard
                    key={`request-${index}`}
                    cookie={cookie}
                    keyClassName={colors.textAccent1}
                  />
                ))}
              </div>
            </Section>
          )}

          {hasResponseCookies && (
            <Section
              title={`Response Cookies (${responseCookies.length})`}
            >
              <div className="space-y-2">
                {responseCookies.map((cookie, index) => (
                  <CookieCard
                    key={`response-${index}`}
                    cookie={cookie}
                    keyClassName={colors.textAccent2}
                  />
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
