import config from "@config/config.json";
import social from "@config/social.json";
import ImageFallback from "@layouts/components/ImageFallback";
import Logo from "@layouts/components/Logo";
import CustomForm from "@layouts/components/NewsLetterForm";
import Social from "@layouts/components/Social";
import dateFormat from "@lib/utils/dateFormat";
import { sortByDate } from "@lib/utils/sortFunctions";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { useState } from "react";
import { FaRegCalendar } from "react-icons/fa";
import MailchimpSubscribe from "react-mailchimp-subscribe";
const { blog_folder } = config.settings;
const { about, featured_posts, newsletter } = config.widgets;

const Sidebar = ({ posts, categories, className }) => {
  const sortPostByDate = sortByDate(posts);
  const featuredPosts = sortPostByDate.filter(
    (post) => post.frontmatter.featured
  );

  const [showRecent, setShowRecent] = useState(true);

  return (
    <aside className={`${className} px-0`}>
      {/* categories widget - MOVED TO TOP */}
      {categories.enable && (
        <div className="mt-6 rounded p-6"> {/* Removed border classes */}
          <h4 className="section-title mb-12 text-center text-foreground">
            {featured_posts.title} {/* This title seems to be for categories, not "Featured Posts" based on config */}
          </h4>
          <ul>
            {categories.map((category, i) => (
              <li
                className={`relative mb-2 flex items-center justify-between pl-6 text-[16px] font-bold capitalize text-foreground ${
                  i !== categories.length - 1 &&
                  "border-b border-border"
                }`}
                key={i}
              >
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-px bg-muted-foreground"></div> {/* Simple straight line */}
                <Link className="py-2" href={`/categories/${category.name}`}>
                  {category.name.replace("-", " ")}
                  <span className="absolute top-1/2 right-0 -translate-y-1/2 text-[10px] text-muted-foreground">
                    {category.posts}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* featured widget - "Featured" heading removed, map/about widget moved below this */}
      {featured_posts.enable && (
        <div className="mt-6 rounded p-6"> {/* Ensured all border classes are removed */}
          {/* <h4 className="section-title mb-12 text-center">Featured</h4> REMOVED Featured Heading */}
          <div className="mb-6 flex items-center justify-center"> {/* Reduced mb-12 to mb-6 */}
            <button
              className={`btn px-3 py-1 ${ /* Reduced padding from px-5 py-2 */
                showRecent ? "btn-outline-primary" : "btn-primary"
              }`}
              onClick={() => setShowRecent(false)}
            >
              Featured
            </button>
            <button
              className={`btn ml-3 px-3 py-1 ${ /* Reduced padding from px-5 py-2 */
                showRecent ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setShowRecent(true)}
            >
              Recent
            </button>
          </div>
          {showRecent
            ? sortPostByDate
                .slice(0, featured_posts.showPost)
                .map((post, i, arr) => (
                  <div
                    className={`flex items-center ${
                      i !== arr.length - 1 &&
                      "mb-6 border-b border-border pb-6 dark:border-darkmode-border"
                    }`}
                    key={`key-${i}`}
                  >
                    {post.frontmatter.image && (
                      <ImageFallback
                        className="mr-3 h-[85px] w-[85px] rounded-full object-cover"
                        src={post.frontmatter.image}
                        alt={post.frontmatter.title}
                        width={105}
                        height={85}
                        quality={90}
                        sizes="(max-width: 768px) 85px, 105px"
                      />
                    )}
                    <div>
                      <h3 className="h5 mb-2 text-foreground">
                        <Link
                          href={`/${blog_folder}/${post.slug}`}
                          className="block hover:text-primary"
                        >
                          {post.frontmatter.title}
                        </Link>
                      </h3>
                      <p className="inline-flex items-center font-secondary text-xs">
                        <FaRegCalendar className="mr-1.5" />
                        {dateFormat(post.frontmatter.date)}
                      </p>
                    </div>
                  </div>
                ))
            : featuredPosts
                .slice(0, featured_posts.showPost)
                .map((post, i, arr) => (
                  <div
                    className={`flex items-center pb-6 ${
                      i !== arr.length - 1 &&
                      "mb-6 border-b dark:border-b-darkmode-border"
                    }`}
                    key={`key-${i}`}
                  >
                    {post.frontmatter.image && (
                      <ImageFallback
                        className="mr-3 h-[85px] w-[85px] rounded-full object-cover"
                        src={post.frontmatter.image}
                        alt={post.frontmatter.title}
                        width={105}
                        height={85}
                        quality={90}
                        sizes="(max-width: 768px) 85px, 105px"
                      />
                    )}
                    <div>
                      <h3 className="h5 mb-2 text-foreground">
                        <Link
                          href={`/${blog_folder}/${post.slug}`}
                          className="block hover:text-primary"
                        >
                          {post.frontmatter.title}
                        </Link>
                      </h3>
                      <p className="inline-flex items-center font-secondary text-xs">
                        <FaRegCalendar className="mr-1.5" />
                        {dateFormat(post.frontmatter.date)}
                      </p>
                    </div>
                  </div>
                ))}
        </div>
      )}

      {/* about widget - MOVED HERE, BELOW FEATURED */}
      {/* {about.enable && (
        <div className="relative mt-6 rounded p-6 text-center">
          <ImageFallback
            className="-z-[1]"
            src="/images/map.svg"
            fill={true}
            alt="bg-map"
          />
          <Logo />
          {markdownify(about.content, "p", "mt-8")}
          <Social
            className="socials sidebar-socials mt-6 justify-center"
            source={social}
          />
        </div>
      )} */}

      {/* newsletter */}
      {newsletter.enable && (
        <div className="mt-6"> {/* Removed rounded, p-6, text-center */}
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-primary text-foreground">{newsletter.title}</h2>
          <p className="mt-4 mb-2 text-xs text-center text-foreground">{newsletter.content}</p> {/* Re-added newsletter.content with smaller margins and centered */}
          <MailchimpSubscribe
            url={newsletter.mailchimp_form_action}
            render={({ subscribe, status, message }) => (
              <CustomForm /* Add mb-2 or mb-4 here if needed after testing */
                onValidated={(formData) => subscribe(formData)}
                status={status}
                message={message}
              />
            )}
          />
          <p className="text-xs text-center mt-2 text-foreground"> {/* Changed mt-4 to mt-2 */}
            By Singing Up, You Agree To
            <Link
              href={newsletter.privacy_policy_page}
              className="ml-1 text-primary"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
