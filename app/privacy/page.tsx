import type { Metadata } from "next";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...createPageMetadata(
    "개인정보 처리방침",
    "한입 링크의 개인정보 처리방침 안내 페이지입니다.",
  ),
  robots: { index: true, follow: true },
};

const SERVICE_NAME = "한입 링크";
const OPERATOR_NAME = "김종성";
const CONTACT_EMAIL = "overbold@naver.com";
const EFFECTIVE_DATE = new Date().toISOString().slice(0, 10);

type PolicySectionProps = PropsWithChildren<{
  id: string;
  title: string;
}>;

function PolicySection({ id, title, children }: PolicySectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6"
    >
      <h2 className="mb-4 text-[20px] font-bold leading-[1.4] tracking-[-0.025em] text-[var(--text)]">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-[1.75] text-[var(--text-sub)] sm:text-[16px]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-svh bg-[var(--background)] px-5 py-9 sm:py-12">
      <div className="mx-auto max-w-[640px]">
        <Link
          href="/"
          className="privacy-link inline-flex items-center gap-1 text-[14px] font-semibold text-[var(--text-sub)]"
        >
          <span aria-hidden="true">←</span>
          한입 링크로 돌아가기
        </Link>

        <header className="mt-7 rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <p className="text-[13px] font-bold text-[var(--accent)]">
            Privacy Policy
          </p>
          <h1 className="mt-2 text-[26px] font-bold leading-[1.3] tracking-[-0.035em] text-[var(--text)]">
            개인정보 처리방침
          </h1>
          <p className="mt-3 text-[14px] leading-[1.5] text-[var(--text-sub)]">
            시행일: <time dateTime={EFFECTIVE_DATE}>{EFFECTIVE_DATE}</time>
          </p>
        </header>

        <section className="mt-6 rounded-2xl bg-[var(--surface)] p-5 text-[15px] leading-[1.75] text-[var(--text-sub)] shadow-[var(--shadow-card)] sm:p-6 sm:text-[16px]">
          <p>
            {SERVICE_NAME}(이하 &quot;서비스&quot;)은 정보주체의 자유와
            권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한
            바를 준수하여, 적법하게 개인정보를 처리하고 안전하게
            관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라
            정보주체에게 개인정보의 처리와 보호에 관한 절차 및 기준을
            안내하고, 관련 고충을 신속하고 원활하게 처리할 수 있도록
            다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
        </section>

        <nav
          aria-label="개인정보 처리방침 목차"
          className="mt-6 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6"
        >
          <h2 className="text-[17px] font-bold text-[var(--text)]">목차</h2>
          <ol className="mt-4 grid list-decimal gap-x-8 gap-y-2 pl-5 text-[14px] leading-6 text-[var(--text-sub)] sm:grid-cols-2">
            <li><a href="#s1" className="privacy-link">개인정보의 처리 목적</a></li>
            <li><a href="#s2" className="privacy-link">처리하는 개인정보의 항목</a></li>
            <li><a href="#s3" className="privacy-link">개인정보의 처리 및 보유 기간</a></li>
            <li><a href="#s4" className="privacy-link">개인정보의 파기 절차 및 방법</a></li>
            <li><a href="#s5" className="privacy-link">개인정보 처리업무의 위탁</a></li>
            <li><a href="#s6" className="privacy-link">정보주체의 권리·의무 및 행사방법</a></li>
            <li><a href="#s7" className="privacy-link">개인정보의 안전성 확보 조치</a></li>
            <li><a href="#s8" className="privacy-link">쿠키 운영 및 거부 방법</a></li>
            <li><a href="#s9" className="privacy-link">개인정보 보호책임자</a></li>
            <li><a href="#s10" className="privacy-link">권익침해 구제방법</a></li>
            <li><a href="#s11" className="privacy-link">처리방침의 변경</a></li>
          </ol>
        </nav>

        <div className="mt-6 space-y-6">
          <PolicySection id="s1" title="1. 개인정보의 처리 목적">
            <p>
              {SERVICE_NAME}은 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
              이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보
              보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를
              이행할 예정입니다.
            </p>
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                <strong className="text-[var(--text)]">회원 가입 및 관리</strong>
                <br />
                회원 가입 의사 확인, 본인 식별·인증, 회원자격 유지·관리,
                서비스 부정이용 방지 목적으로 개인정보를 처리합니다.
              </li>
              <li>
                <strong className="text-[var(--text)]">서비스 제공</strong>
                <br />
                {SERVICE_NAME}의 기능 제공 및 서비스 운영을 위하여
                개인정보를 처리합니다.
              </li>
              <li>
                <strong className="text-[var(--text)]">고충 처리</strong>
                <br />
                정보주체의 문의사항 확인 및 사실조사를 위한 연락·통지,
                처리결과 통보 목적으로 개인정보를 처리합니다.
              </li>
            </ol>
          </PolicySection>

          <PolicySection id="s2" title="2. 처리하는 개인정보의 항목">
            <div>
              <h3 className="font-bold text-[var(--text)]">
                가. 회원가입 시 수집·이용 항목
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <strong className="text-[var(--text)]">법적 근거</strong>:
                  「개인정보 보호법」 제15조제1항제4호(계약 체결·이행)
                </li>
                <li>
                  <strong className="text-[var(--text)]">필수 항목</strong>:
                  이메일 주소, 비밀번호(단방향 암호화하여 저장, 원문은
                  보관하지 않음)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[var(--text)]">
                나. 서비스 이용 과정에서 자동 수집되는 항목
              </h3>
              <p className="mt-2">
                IP 주소, 쿠키, 서비스 이용 기록, 접속 로그, 브라우저 정보,
                기기 정보
              </p>
            </div>
          </PolicySection>

          <PolicySection id="s3" title="3. 개인정보의 처리 및 보유 기간">
            <p>
              {SERVICE_NAME}은 법령에 따른 개인정보 보유·이용기간 또는
              정보주체로부터 개인정보를 수집할 때 동의받은 개인정보
              보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full min-w-[440px] border-collapse text-left text-[14px]">
                <thead className="bg-[var(--surface-subtle)] text-[var(--text)]">
                  <tr>
                    <th className="border-b border-[var(--border)] px-4 py-3">처리 목적</th>
                    <th className="border-b border-[var(--border)] px-4 py-3">보유 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-[var(--border)] px-4 py-3">회원 가입 및 관리</td>
                    <td className="border-b border-[var(--border)] px-4 py-3">회원 탈퇴 시까지</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">서비스 제공</td>
                    <td className="px-4 py-3">서비스 제공 완료 시까지</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[14px]">
              다만, 관계 법령 위반에 따른 수사·조사가 진행 중이거나 관련
              법령에 따른 보존 의무가 있는 경우에는 해당 기간 종료
              시까지 보유합니다.
            </p>
          </PolicySection>

          <PolicySection id="s4" title="4. 개인정보의 파기 절차 및 방법">
            <p>
              {SERVICE_NAME}은 개인정보 보유기간의 경과, 처리목적 달성 등
              개인정보가 불필요하게 되었을 때에는 지체 없이 해당
              개인정보를 파기합니다.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[var(--text)]">파기 절차</strong>:
                이용자의 회원 탈퇴 요청 또는 보유기간 만료 시 즉시 파기
              </li>
              <li>
                <strong className="text-[var(--text)]">파기 방법</strong>:
                전자적 파일은 복구 및 재생이 불가능한 방법으로 영구 삭제
              </li>
            </ul>
          </PolicySection>

          <PolicySection id="s5" title="5. 개인정보 처리업무의 위탁">
            <p>
              {SERVICE_NAME}은 원활한 서비스 운영을 위해 다음과 같이
              개인정보 처리업무를 위탁하고 있습니다. 모든 위탁 업체는
              대한민국 리전(Seoul)에서 개인정보를 저장·처리하고 있습니다.
            </p>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full min-w-[620px] border-collapse text-left text-[14px]">
                <thead className="bg-[var(--surface-subtle)] text-[var(--text)]">
                  <tr>
                    <th className="border-b border-[var(--border)] px-4 py-3">수탁업체</th>
                    <th className="border-b border-[var(--border)] px-4 py-3">위탁 업무</th>
                    <th className="border-b border-[var(--border)] px-4 py-3">처리 지역</th>
                    <th className="border-b border-[var(--border)] px-4 py-3">보유·이용 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-[var(--border)] px-4 py-3">Supabase Inc.</td>
                    <td className="border-b border-[var(--border)] px-4 py-3">회원 정보 저장 및 인증 처리, 데이터베이스 운영</td>
                    <td className="border-b border-[var(--border)] px-4 py-3">대한민국 (Seoul 리전)</td>
                    <td className="border-b border-[var(--border)] px-4 py-3">회원 탈퇴 또는 위탁계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Vercel Inc.</td>
                    <td className="px-4 py-3">웹 서비스 호스팅 및 배포</td>
                    <td className="px-4 py-3">대한민국 (Seoul Edge)</td>
                    <td className="px-4 py-3">위탁계약 종료 시까지</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[14px]">
              {SERVICE_NAME}은 「개인정보 보호법」 제26조에 따라 위탁계약
              시 개인정보의 안전한 처리를 위한 기술적·관리적 보호조치,
              재위탁 제한, 관리·감독 등 책임에 관한 사항을 계약에 반영하고
              있습니다.
            </p>
          </PolicySection>

          <PolicySection id="s6" title="6. 정보주체의 권리·의무 및 행사방법">
            <p>
              정보주체는 {SERVICE_NAME}에 대해 언제든지 다음과 같은
              개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정·삭제 요구</li>
              <li>개인정보 처리정지 요구</li>
              <li>개인정보 처리에 대한 동의 철회</li>
            </ol>
            <p>
              권리 행사는 이메일({" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="privacy-link font-semibold text-[var(--accent)]"
              >
                {CONTACT_EMAIL}
              </a>
              )로 할 수 있으며, {SERVICE_NAME}은 이에 대해 지체 없이
              조치하겠습니다.
            </p>
          </PolicySection>

          <PolicySection id="s7" title="7. 개인정보의 안전성 확보 조치">
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <strong className="text-[var(--text)]">기술적 조치</strong>:
                접근 권한 관리, 비밀번호 단방향 암호화 저장, HTTPS 통신
                암호화, Row Level Security(RLS) 적용
              </li>
              <li>
                <strong className="text-[var(--text)]">관리적 조치</strong>:
                개인정보 취급 담당자 최소화, 정기적인 자체 점검
              </li>
              <li>
                <strong className="text-[var(--text)]">물리적 조치</strong>:
                국제 보안 인증(SOC 2 등)을 획득한 클라우드 인프라를
                대한민국 리전에서 활용
              </li>
            </ul>
          </PolicySection>

          <PolicySection id="s8" title="8. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부">
            <p>
              {SERVICE_NAME}은 로그인 상태 유지 및 이용자 맞춤 서비스
              제공을 위해 쿠키(cookie)를 사용합니다.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[var(--text)]">사용 목적</strong>:
                로그인 세션 유지, 이용자 환경 설정 저장
              </li>
              <li>
                <strong className="text-[var(--text)]">거부 방법</strong>:
                웹브라우저 설정의 개인정보 보호 및 보안 메뉴에서 쿠키
                저장을 거부할 수 있습니다. 다만, 쿠키 저장을 거부하면
                로그인이 필요한 일부 서비스 이용이 제한될 수 있습니다.
              </li>
            </ul>
          </PolicySection>

          <PolicySection id="s9" title="9. 개인정보 보호책임자">
            <p>
              {SERVICE_NAME}은 개인정보 처리에 관한 업무를 총괄하여
              책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및
              피해구제를 위해 아래와 같이 개인정보 보호책임자를 지정하고
              있습니다.
            </p>
            <div className="rounded-xl bg-[var(--surface-subtle)] p-4">
              <p>
                <strong className="text-[var(--text)]">개인정보 보호책임자</strong>:{" "}
                {OPERATOR_NAME}
              </p>
              <p className="mt-1">
                <strong className="text-[var(--text)]">연락처</strong>:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="privacy-link font-semibold text-[var(--accent)]"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </PolicySection>

          <PolicySection id="s10" title="10. 권익침해 구제방법">
            <p>
              정보주체는 개인정보 침해로 인한 구제를 받기 위하여 아래
              기관에 분쟁 해결이나 상담을 신청할 수 있습니다.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                개인정보분쟁조정위원회: (국번없이) 1833-6972 ({" "}
                <a href="https://www.kopico.go.kr" target="_blank" rel="noreferrer noopener" className="privacy-link font-semibold text-[var(--accent)]">www.kopico.go.kr</a>
                )
              </li>
              <li>
                개인정보침해신고센터: (국번없이) 118 ({" "}
                <a href="https://privacy.kisa.or.kr" target="_blank" rel="noreferrer noopener" className="privacy-link font-semibold text-[var(--accent)]">privacy.kisa.or.kr</a>
                )
              </li>
              <li>
                대검찰청: (국번없이) 1301 ({" "}
                <a href="https://www.spo.go.kr" target="_blank" rel="noreferrer noopener" className="privacy-link font-semibold text-[var(--accent)]">www.spo.go.kr</a>
                )
              </li>
              <li>
                경찰청: (국번없이) 182 ({" "}
                <a href="https://ecrm.cyber.go.kr" target="_blank" rel="noreferrer noopener" className="privacy-link font-semibold text-[var(--accent)]">ecrm.cyber.go.kr</a>
                )
              </li>
            </ul>
          </PolicySection>

          <PolicySection id="s11" title="11. 개인정보 처리방침의 변경">
            <p>
              이 개인정보 처리방침은 {EFFECTIVE_DATE}부터 적용됩니다.
              법령, 정책 또는 보안기술 변경에 따라 내용이 추가·삭제 또는
              수정될 경우 변경 사항을 시행일 7일 전부터 서비스 내
              공지사항을 통해 고지합니다.
            </p>
          </PolicySection>
        </div>

        <footer className="py-10 text-center text-[13px] text-[var(--text-muted)]">
          <p>시행일: {EFFECTIVE_DATE}</p>
        </footer>
      </div>
    </main>
  );
}
